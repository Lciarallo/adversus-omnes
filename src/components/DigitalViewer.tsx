import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Shield,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Type,
  Image as ImageIcon,
  FileText,
  BookOpen,
  ExternalLink,
  List,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatalogItem } from '../types';
import { useToast } from './ui/Toast';

export type ReaderViewMode = 'document' | 'facsimile' | 'text';

interface DigitalViewerProps {
  item: CatalogItem;
  onBack: () => void;
}

const MIN_ZOOM = 80;
const MAX_ZOOM = 200;
const ZOOM_STEP = 20;

const isNarrowViewport = () => typeof window !== 'undefined' && window.innerWidth < 900;

/* A última folha aberta de cada obra: reabrir o leitor retoma a leitura. */
const pageKey = (id: string) => `contraste_reader_page_${id}`;
const readSavedPage = (id: string, total: number) => {
  try {
    const saved = Number(localStorage.getItem(pageKey(id)));
    return Number.isInteger(saved) && saved >= 1 && saved <= total ? saved : 1;
  } catch {
    return 1;
  }
};

const MODE_LABEL: Record<ReaderViewMode, { full: string; short: string; hint: string }> = {
  facsimile: { full: 'Folhas', short: 'Folhas', hint: 'Folhas restauradas em alta resolução' },
  document: { full: 'Volume integral', short: 'Integral', hint: 'Todas as páginas digitalizadas da obra' },
  text: { full: 'Transcrição', short: 'Texto', hint: 'Transcrição em texto, ajustável e legível por leitores de tela' }
};

export const DigitalViewer: React.FC<DigitalViewerProps> = ({ item, onBack }) => {
  const { currentUser, plans, startSubscriptionCheckout, transitioningCoverId, setTransitioningCoverId } = useStore();
  const { notify } = useToast();

  const googleDriveId = item.googleDriveId || item.downloadUrl?.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
  const documentEmbedUrl = item.embedUrl || (googleDriveId ? `https://drive.google.com/file/d/${googleDriveId}/preview` : null);

  const pages = item.pdfPages?.length
    ? item.pdfPages
    : [{ pageNumber: 1, title: item.title, content: item.description }];
  const totalPages = pages.length;

  const initialMode = (): ReaderViewMode =>
    isNarrowViewport() || !documentEmbedUrl ? 'facsimile' : 'document';

  const [viewMode, setViewMode] = useState<ReaderViewMode>(initialMode);
  const [currentPage, setCurrentPage] = useState(() => readSavedPage(item.id, totalPages));
  const [zoom, setZoom] = useState(100);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerContainerRef = useRef<HTMLElement | null>(null);
  const pageFrameRef = useRef<HTMLDivElement | null>(null);
  const indexTriggerRef = useRef<HTMLElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // A largura define a composição da folha, preservando o tamanho das letras.
  const [frameWidth, setFrameWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(800, Math.max(280, window.innerWidth - 16)) : 800
  );

  const isExclusive = item.access === 'exclusive';
  const hasAccess = !isExclusive || currentUser.role === 'subscriber' || currentUser.role === 'admin';
  const activePage = pages[currentPage - 1] || pages[0];
  const isExampleDownload = /(?:^|\/)dummy\.pdf(?:[?#]|$)/i.test(item.downloadUrl || '');
  const preferredPlan = plans[1] || plans[0];
  const planPrice = preferredPlan
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preferredPlan.priceMonthly)
    : null;
  const paged = viewMode !== 'document';

  const goToPage = (page: number) => setCurrentPage(Math.min(totalPages, Math.max(1, page)));

  // Troca de obra: volta ao modo inicial e retoma a folha salva.
  useEffect(() => {
    setCurrentPage(readSavedPage(item.id, totalPages));
    setZoom(100);
    setViewMode(initialMode());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, documentEmbedUrl]);

  useEffect(() => {
    try {
      localStorage.setItem(pageKey(item.id), String(currentPage));
    } catch {
      // Sem armazenamento: a leitura segue, só não é retomada.
    }
  }, [item.id, currentPage]);

  // Gaveta de índice: Esc fecha, o foco entra no painel e volta ao gatilho.
  useEffect(() => {
    if (!isIndexOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    indexTriggerRef.current = trigger;
    requestAnimationFrame(() => drawerCloseRef.current?.focus());
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsIndexOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      indexTriggerRef.current?.focus?.();
    };
  }, [isIndexOpen]);

  // Setas do teclado viram a folha (fora de campos de texto e do volume integral).
  useEffect(() => {
    if (!hasAccess || !paged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isIndexOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.getAttribute('role') === 'tab') return;
      if (e.key === 'ArrowRight') setCurrentPage(p => Math.min(totalPages, p + 1));
      else if (e.key === 'ArrowLeft') setCurrentPage(p => Math.max(1, p - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasAccess, paged, isIndexOpen, totalPages]);

  useEffect(() => {
    const frame = pageFrameRef.current;
    const measure = () => {
      const containerW = frame ? frame.clientWidth : window.innerWidth;
      const styles = frame ? getComputedStyle(frame) : null;
      const padding = styles ? (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0) : 24;
      const available = containerW - padding;
      if (available > 0) setFrameWidth(Math.min(800, available));
    };

    measure();
    const observer = frame && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (observer && frame) observer.observe(frame);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isFullscreen, hasAccess, viewMode]);

  const handleBack = () => {
    onBack();
    setTimeout(() => setTransitioningCoverId(null), 480);
  };

  // Restrições de extração no material exclusivo
  useEffect(() => {
    if (!isExclusive || !hasAccess) return;

    const flag = () => {
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c', 'u', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        flag();
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      flag();
    };

    window.addEventListener('keydown', handleKeyDown);
    const container = viewerContainerRef.current;
    container?.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      container?.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isExclusive, hasAccess]);

  // Folha fac-similar (ou composição tipográfica) desenhada no canvas
  useEffect(() => {
    if (!hasAccess || viewMode !== 'facsimile') return;
    let cancelled = false;

    const draw = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderWatermark = (h: number) => {
        if (!isExclusive) return;
        ctx.save();
        ctx.fillStyle = 'rgba(184, 49, 26, 0.08)';
        ctx.font = 'bold 13px sans-serif';
        const watermark = `ADVERSUS OMNES · ${currentUser.name.toUpperCase()} (${currentUser.email}) · USO EXCLUSIVO`;
        for (let row = 90; row < h - 30; row += 150) ctx.fillText(watermark, 24, row);
        ctx.restore();
      };

      if (activePage.imageUrl) {
        const img = new Image();
        img.src = activePage.imageUrl;

        const onImageReady = () => {
          if (cancelled) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const scale = zoom / 100;
          const imgAspect = img.naturalHeight && img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1.414;
          const pageWidth = frameWidth;
          const renderWidth = pageWidth * scale;
          const renderHeight = renderWidth * imgAspect;

          canvas.width = Math.ceil(renderWidth * dpr);
          canvas.height = Math.ceil(renderHeight * dpr);
          canvas.style.width = `${renderWidth}px`;
          canvas.style.height = `${renderHeight}px`;

          ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
          ctx.drawImage(img, 0, 0, pageWidth, pageWidth * imgAspect);
          renderWatermark(pageWidth * imgAspect);
        };

        if (img.complete && img.naturalWidth > 0) onImageReady();
        else img.onload = onImageReady;
        return;
      }

      // Obra sem digitalização da folha: composição tipográfica da página
      const pageWidth = frameWidth;
      const margin = pageWidth < 480 ? 28 : 54;
      const textWidth = Math.max(80, pageWidth - margin * 2);
      const lines: { text: string; y: number; font: string; color: string }[] = [];
      let y = 48;
      const paragraph = (text: string, font: string, color: string, leading: number) => {
        ctx.font = font;
        let line = '';
        for (const word of text.trim().split(/\s+/)) {
          const candidate = line ? line + ' ' + word : word;
          if (ctx.measureText(candidate).width <= textWidth) {
            line = candidate;
            continue;
          }
          if (line) {
            lines.push({ text: line, y, font, color });
            y += leading;
          }
          line = '';
          for (const char of word) {
            if (line && ctx.measureText(line + char).width > textWidth) {
              lines.push({ text: line, y, font, color });
              y += leading;
              line = '';
            }
            line += char;
          }
        }
        if (line) {
          lines.push({ text: line, y, font, color });
          y += leading;
        }
      };

      paragraph(activePage.title, '700 25px "Cormorant Garamond", Georgia, serif', '#14110e', 29);
      y += 20;
      for (const part of activePage.content.split(/\n+/).filter(part => part.trim())) {
        paragraph(part, '17px "Spectral", Georgia, serif', '#14110e', 30);
        y += 16;
      }
      const footerY = y + 22;
      paragraph(`Página ${currentPage} de ${totalPages} · ${item.year}`, '12px "Outfit", sans-serif', '#68573d', 18);
      const pageHeight = Math.max(pageWidth * 1.375, y + 50);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = zoom / 100;
      canvas.width = Math.ceil(pageWidth * scale * dpr);
      canvas.height = Math.ceil(pageHeight * scale * dpr);
      canvas.style.width = pageWidth * scale + 'px';
      canvas.style.height = pageHeight * scale + 'px';
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.fillStyle = '#fbf8f1';
      ctx.fillRect(0, 0, pageWidth, pageHeight);
      ctx.strokeStyle = '#d8ccb4';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, pageWidth - 24, pageHeight - 24);
      for (const line of lines) {
        ctx.font = line.font;
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, margin, line.y);
      }
      ctx.strokeStyle = '#b8311a';
      ctx.beginPath();
      ctx.moveTo(margin, footerY - 32);
      ctx.lineTo(Math.min(pageWidth - margin, margin + 64), footerY - 32);
      ctx.stroke();

      renderWatermark(pageHeight);
    };

    draw();
    void document.fonts.ready.then(draw);
    return () => {
      cancelled = true;
    };
  }, [item, currentPage, zoom, hasAccess, viewMode, currentUser, isExclusive, totalPages, activePage, frameWidth]);

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenEnabled) {
      notify('Tela cheia indisponível neste navegador. Use a ampliação para ler com mais conforto.', 'info');
      return;
    }
    if (!document.fullscreenElement) {
      viewerContainerRef.current
        .requestFullscreen()
        .catch(() => notify('Este navegador não permitiu abrir o leitor em tela cheia.', 'error'));
    } else {
      document
        .exitFullscreen()
        .catch(() => notify('Não foi possível sair da tela cheia. Pressione Esc para tentar novamente.', 'error'));
    }
  };

  useEffect(() => {
    pageFrameRef.current?.scrollTo({ top: 0, left: 0 });
  }, [currentPage, viewMode]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !paged) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 48) {
      setCurrentPage(p => (deltaX < 0 ? Math.min(totalPages, p + 1) : Math.max(1, p - 1)));
    }
  };

  const modes: ReaderViewMode[] = documentEmbedUrl ? ['facsimile', 'document', 'text'] : ['facsimile', 'text'];
  const pad = (n: number) => String(n).padStart(2, '0');

  const zoomControls = (
    <div className="reader-zoom" role="group" aria-label="Ampliação da página">
      <button
        type="button"
        disabled={zoom <= MIN_ZOOM}
        onClick={() => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
        aria-label="Diminuir ampliação"
      >
        <ZoomOut size={15} aria-hidden="true" />
      </button>
      <output aria-live="polite">{zoom}%</output>
      <button
        type="button"
        disabled={zoom >= MAX_ZOOM}
        onClick={() => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
        aria-label="Aumentar ampliação"
      >
        <ZoomIn size={15} aria-hidden="true" />
      </button>
    </div>
  );

  const fullscreenButton = (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? 'Sair da tela cheia' : 'Ler em tela cheia'}
      className="reader-tool"
    >
      {isFullscreen ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
      <span>{isFullscreen ? 'Sair' : 'Tela cheia'}</span>
    </button>
  );

  const leafList = (onPick?: () => void) => (
    <ol className="reader-leaves">
      {pages.map((page, index) => {
        const isActive = currentPage === index + 1 && paged;
        return (
          <li key={`${page.pageNumber}-${page.title}`}>
            <button
              type="button"
              onClick={() => {
                goToPage(index + 1);
                if (viewMode === 'document') setViewMode('facsimile');
                onPick?.();
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{pad(page.pageNumber)}</span>
              <strong>{page.title}</strong>
            </button>
          </li>
        );
      })}
    </ol>
  );

  const register = (
    <dl className="reader-register">
      <div><dt>Registro</dt><dd>{item.id.toUpperCase()}</dd></div>
      <div><dt>Autoria</dt><dd>{item.author || 'Não identificada'}</dd></div>
      <div><dt>Datação</dt><dd>{item.year}</dd></div>
      <div><dt>Fundo</dt><dd>{item.publisher || 'Arquivo Adversus Omnes'}</dd></div>
      <div><dt>Movimento</dt><dd>{item.politicalMovement}</dd></div>
      {item.event && <div><dt>Contexto</dt><dd>{item.event}</dd></div>}
      <div><dt>Extensão</dt><dd>{item.pages} páginas no original · {totalPages} em destaque</dd></div>
    </dl>
  );

  return (
    <div className="reader">
      {copiedAlert && (
        <div role="alert" className="reader-alert">
          <ShieldAlert size={18} aria-hidden="true" />
          <span>Esta cópia de consulta restringe atalhos de extração e impressão. Capturas de tela ainda são possíveis.</span>
        </div>
      )}

      <header className="reader-mast">
        <button type="button" onClick={handleBack} className="reader-back" aria-label="Voltar ao acervo online">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Acervo</span>
        </button>

        <div className="reader-title">
          <h1>{item.title}</h1>
          <p>
            <span className="reader-title__author">{item.author || 'Autoria não identificada'}</span>
            <span aria-hidden="true">·</span>
            <span>{item.year}</span>
            <span aria-hidden="true">·</span>
            <span className={`reader-access reader-access--${isExclusive ? 'restricted' : 'open'}`}>
              {isExclusive ? <Shield size={12} aria-hidden="true" /> : <FileText size={12} aria-hidden="true" />}
              {isExclusive ? 'Consulta reservada' : 'Consulta aberta'}
            </span>
          </p>
        </div>

        {item.downloadUrl && hasAccess && (
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={isExampleDownload ? 'Abrir PDF de exemplo (não contém esta obra)' : `Baixar o fac-símile integral de ${item.title}`}
            className="reader-download"
          >
            <Download size={15} aria-hidden="true" />
            <span>{isExampleDownload ? 'PDF de exemplo' : 'Baixar PDF'}</span>
          </a>
        )}
      </header>

      {!hasAccess ? (
        <section className="reader-gate" aria-labelledby="reader-gate-title">
          <figure className="reader-gate__cover">
            <img src={item.coverImage} alt={`Capa de ${item.title}`} decoding="async" />
          </figure>

          <div className="reader-gate__copy">
            <h2 id="reader-gate-title">Assine para ler esta obra integral.</h2>
            <p>
              A assinatura abre a coleção reservada: as {item.pages} páginas do fac-símile, as folhas
              restauradas em alta definição e as transcrições anotadas.
            </p>

            <div className="reader-gate__actions">
              <button
                type="button"
                onClick={() => preferredPlan && startSubscriptionCheckout(preferredPlan)}
                disabled={!preferredPlan}
                className="reader-gate__primary"
              >
                <span>Assinar para ler</span>
                {preferredPlan && (
                  <small>
                    {preferredPlan.name}
                    {planPrice ? ` · ${planPrice}/mês` : ''}
                  </small>
                )}
              </button>
              <button type="button" onClick={handleBack} className="reader-gate__secondary">
                Ver o acervo aberto
              </button>
            </div>
            <p className="reader-gate__note">Demonstração: nenhuma cobrança real é feita neste protótipo.</p>

            <dl className="reader-gate__register">
              <div><dt>Fundo</dt><dd>{item.publisher || 'Arquivo Adversus Omnes'}</dd></div>
              <div><dt>Período</dt><dd>{item.period}</dd></div>
              <div><dt>Movimento</dt><dd>{item.politicalMovement}</dd></div>
            </dl>
          </div>
        </section>
      ) : (
        <section
          ref={viewerContainerRef}
          className={`reader-desk ${isFullscreen ? 'reader-desk--fullscreen' : ''}`}
          aria-label={`Leitor de ${item.title}`}
        >
          {/* Lateral de consulta: índice sempre à mão, ficha sob demanda */}
          <aside className="reader-side" aria-label="Índice e ficha da obra">
            <nav aria-label="Folhas em destaque">
              <h2 className="reader-side__title">
                Índice <span>{totalPages} folhas</span>
              </h2>
              {leafList()}
            </nav>
            <details className="reader-side__details">
              <summary>Ficha catalográfica</summary>
              {register}
            </details>
            <p className="reader-side__note">
              {isExclusive
                ? 'As folhas levam marca d’água com o nome do assinante. É dissuasão, não criptografia.'
                : 'Documento aberto ao público.'}
            </p>
          </aside>

          <div className="reader-surface">
            <div className="reader-bar" role="toolbar" aria-label="Ferramentas de leitura">
              <div className="reader-modes" role="tablist" aria-label="Modo de leitura">
                {modes.map(mode => {
                  const Icon = mode === 'facsimile' ? ImageIcon : mode === 'document' ? BookOpen : Type;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="tab"
                      aria-selected={viewMode === mode}
                      onClick={() => setViewMode(mode)}
                      title={MODE_LABEL[mode].hint}
                    >
                      <Icon size={14} aria-hidden="true" />
                      <span className="reader-modes__full">{MODE_LABEL[mode].full}</span>
                      <span className="reader-modes__short">{MODE_LABEL[mode].short}</span>
                    </button>
                  );
                })}
              </div>

              {paged ? (
                <div className="reader-pager" role="group" aria-label="Navegação entre folhas">
                  <button type="button" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)} aria-label="Folha anterior">
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <span className="reader-pager__count" aria-live="polite">
                    <strong>{pad(currentPage)}</strong>
                    <span>/ {pad(totalPages)}</span>
                    <em>{activePage.title}</em>
                  </span>
                  <button type="button" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)} aria-label="Próxima folha">
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <p className="reader-bar__meta">{item.pages} páginas digitalizadas</p>
              )}

              <div className="reader-bar__tools">
                {paged && zoomControls}
                {fullscreenButton}
              </div>

              <button
                type="button"
                onClick={() => setIsIndexOpen(true)}
                className="reader-index-btn"
                aria-label={`Abrir índice, ficha e ajustes (${totalPages} folhas)`}
              >
                <List size={16} aria-hidden="true" />
                <span>Índice</span>
              </button>
            </div>

            <div
              ref={pageFrameRef}
              className={`reader-stage ${viewMode === 'text' ? 'reader-stage--text' : ''} ${isExclusive ? 'user-select-none' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {viewMode === 'document' && documentEmbedUrl ? (
                <div className="reader-volume">
                  <div className="reader-volume__bar">
                    <span>Volume integral · {item.pages} páginas originais</span>
                    <a href={documentEmbedUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={13} aria-hidden="true" />
                      <span>Abrir em nova aba</span>
                    </a>
                  </div>
                  <iframe
                    src={documentEmbedUrl}
                    title={`Volume integral de ${item.title}`}
                    allow="autoplay"
                    loading="lazy"
                  />
                </div>
              ) : viewMode === 'text' ? (
                <div
                  key={`${item.id}-${currentPage}-texto`}
                  style={{ fontSize: `${zoom / 100}rem` }}
                  className="ch-reader-sheet ch-reader-sheet--text"
                >
                  <article className="ch-reader-page">
                    <h2 className="ch-reader-section">{activePage.title}</h2>
                    <div className="ch-reader-body">
                      {activePage.content
                        .split(/\n+/)
                        .map(part => part.trim())
                        .filter(Boolean)
                        .map((part, index) => (
                          <p key={index}>{part}</p>
                        ))}
                    </div>
                    <p className="ch-reader-colophon">
                      Folha {currentPage} de {totalPages} · {item.year} · {item.publisher || 'Arquivo Adversus Omnes'}
                      {isExclusive && ` · Licenciado para ${currentUser.name} (${currentUser.email})`}
                    </p>
                  </article>
                </div>
              ) : (
                <div
                  key={`${item.id}-${currentPage}-folha`}
                  style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                  className="ch-reader-sheet"
                >
                  <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Folha ${currentPage} de ${totalPages} de ${item.title}: ${activePage.title}.`}
                    className="reader-canvas"
                  />
                  <div className="sr-only">
                    <h2>{activePage.title}</h2>
                    <p>{activePage.content}</p>
                  </div>
                  {isExclusive && (
                    <div className="reader-license">Licenciado para {currentUser.name} · {currentUser.email}</div>
                  )}
                </div>
              )}
            </div>

            {/* Polegar: virar folha sem subir até a barra (celular) */}
            {paged && (
              <nav className="reader-thumbbar" aria-label="Virar folha">
                <button type="button" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                  <ChevronLeft size={18} aria-hidden="true" />
                  <span>Anterior</span>
                </button>
                <button type="button" onClick={() => setIsIndexOpen(true)} className="reader-thumbbar__count" aria-label={`Folha ${currentPage} de ${totalPages}. Abrir índice.`}>
                  <strong>{pad(currentPage)}</strong>
                  <span>/ {pad(totalPages)}</span>
                </button>
                <button type="button" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                  <span>Próxima</span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>

          {/* Gaveta: índice, ajustes e ficha fora da lateral (telas menores) */}
          {isIndexOpen && (
            <div className="reader-drawer-backdrop" onClick={() => setIsIndexOpen(false)} role="presentation">
              <div
                className="reader-drawer"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="reader-drawer-title"
              >
                <div className="reader-drawer__head">
                  <h2 id="reader-drawer-title">Índice da obra</h2>
                  <button ref={drawerCloseRef} type="button" onClick={() => setIsIndexOpen(false)} aria-label="Fechar índice">
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <div className="reader-drawer__body">
                  {leafList(() => setIsIndexOpen(false))}

                  {paged && (
                    <section className="reader-drawer__section" aria-labelledby="reader-drawer-adjust">
                      <h3 id="reader-drawer-adjust">Ajustes de leitura</h3>
                      <div className="reader-drawer__adjust">
                        {zoomControls}
                        {fullscreenButton}
                      </div>
                    </section>
                  )}

                  <section className="reader-drawer__section" aria-labelledby="reader-drawer-register">
                    <h3 id="reader-drawer-register">Ficha catalográfica</h3>
                    {register}
                  </section>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
