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

export const DigitalViewer: React.FC<DigitalViewerProps> = ({ item, onBack }) => {
  const { currentUser, plans, startSubscriptionCheckout, transitioningCoverId, setTransitioningCoverId } = useStore();
  const { notify } = useToast();

  const googleDriveId = item.googleDriveId || item.downloadUrl?.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
  const documentEmbedUrl = item.embedUrl || (googleDriveId ? `https://drive.google.com/file/d/${googleDriveId}/preview` : null);

  const isMobileClient = typeof window !== 'undefined' && window.innerWidth < 768;

  const [viewMode, setViewMode] = useState<ReaderViewMode>(() =>
    isMobileClient ? 'facsimile' : (documentEmbedUrl ? 'document' : 'facsimile')
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const pageFrameRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Fecha o drawer com tecla Esc
  useEffect(() => {
    if (!isIndexOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsIndexOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isIndexOpen]);

  // A largura define a composição da folha, preservando o tamanho das letras.
  const [frameWidth, setFrameWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(800, Math.max(300, window.innerWidth - 32)) : 800
  );

  const isExclusive = item.access === 'exclusive';
  const hasAccess = !isExclusive || currentUser.role === 'subscriber' || currentUser.role === 'admin';

  useEffect(() => {
    const frame = pageFrameRef.current;
    const measure = () => {
      const containerW = frame ? frame.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : 800);
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
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isFullscreen, hasAccess]);

  const pages = item.pdfPages?.length ? item.pdfPages : [
    {
      pageNumber: 1,
      title: item.title,
      content: item.description
    }
  ];

  const totalPages = pages.length;
  const activePage = pages[currentPage - 1] || pages[0];
  const isExampleDownload = /(?:^|\/)dummy\.pdf(?:[?#]|$)/i.test(item.downloadUrl || '');
  const preferredPlan = plans[1] || plans[0];
  const planPrice = preferredPlan
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preferredPlan.priceMonthly)
    : null;

  useEffect(() => {
    setCurrentPage(1);
    setZoom(100);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    setViewMode(isMobile ? 'facsimile' : (documentEmbedUrl ? 'document' : 'facsimile'));
  }, [item.id, documentEmbedUrl]);

  const handleBack = () => {
    onBack();
    setTimeout(() => setTransitioningCoverId(null), 480);
  };

  // Security restrictions when exclusive
  useEffect(() => {
    if (!isExclusive || !hasAccess) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+U, Cmd+S, Cmd+P, Cmd+C
      if (
        (e.ctrlKey || e.metaKey) &&
        ['s', 'p', 'c', 'u', 'a'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        setCopiedAlert(true);
        setTimeout(() => setCopiedAlert(false), 2500);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    };

    window.addEventListener('keydown', handleKeyDown);
    const container = viewerContainerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (container) {
        container.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [isExclusive, hasAccess]);

  // Render facsimile scan or historic typeset to canvas
  useEffect(() => {
    if (!hasAccess || viewMode !== 'facsimile') return;
    let cancelled = false;

    const draw = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const activePageData = pages[currentPage - 1] || pages[0];

      const renderWatermark = (w: number, h: number) => {
        if (!isExclusive) return;
        ctx.save();
        ctx.fillStyle = 'rgba(184, 49, 26, 0.08)';
        ctx.font = 'bold 13px sans-serif';
        const watermark = `ADVERSUS OMNES · ${currentUser.name.toUpperCase()} (${currentUser.email}) · USO EXCLUSIVO`;
        for (let row = 90; row < h - 30; row += 150) {
          ctx.fillText(watermark, 24, row);
        }
        ctx.restore();
      };

      if (activePageData.imageUrl) {
        const img = new Image();
        img.src = activePageData.imageUrl;

        const onImageReady = () => {
          if (cancelled || !canvas) return;
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
          renderWatermark(pageWidth, pageWidth * imgAspect);
        };

        if (img.complete && img.naturalWidth > 0) {
          onImageReady();
        } else {
          img.onload = onImageReady;
        }
        return;
      }

      // Fallback for items without facsimile image scan
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

      paragraph(activePageData.title, '700 25px "Cormorant Garamond", Georgia, serif', '#14110e', 29);
      y += 20;
      for (const part of activePageData.content.split(/\n+/).filter(part => part.trim())) {
        paragraph(part, '17px "Spectral", Georgia, serif', '#14110e', 30);
        y += 16;
      }
      const footerY = y + 22;
      paragraph('Página ' + currentPage + ' de ' + totalPages + ' · ' + item.year,
        '12px "Outfit", sans-serif', '#68573d', 18);
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

      renderWatermark(pageWidth, pageHeight);
    };

    draw();
    void document.fonts.ready.then(draw);
    return () => { cancelled = true; };
  }, [item, currentPage, zoom, hasAccess, viewMode, currentUser, isExclusive, totalPages, activePage, frameWidth]);

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenEnabled) {
      notify('Tela cheia indisponível neste navegador. Continue a leitura aqui ou use os controles de ampliação.', 'info');
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
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) > 48) {
      if (deltaX < 0) {
        // Deslizar para esquerda -> próxima folha
        setCurrentPage(p => Math.min(totalPages, p + 1));
      } else {
        // Deslizar para direita -> folha anterior
        setCurrentPage(p => Math.max(1, p - 1));
      }
    }
  };

  return (
    <div className="archive-reader archive-reader--focused">
      {copiedAlert && (
        <div
          role="alert"
          className="archive-reader__alert"
        >
          <ShieldAlert size={19} aria-hidden="true" />
          <span>
            Esta cópia de consulta restringe atalhos de extração e impressão. Capturas de tela ainda são possíveis.
          </span>
        </div>
      )}

      <div className="archive-reader__inner">
        <header className="archive-reader__masthead">
          <button type="button" onClick={handleBack} className="archive-reader__back">
            <ArrowLeft size={17} aria-hidden="true" />
            <span>Voltar ao acervo</span>
          </button>

          <div className="archive-reader__titleblock">
            <h1>{item.title}</h1>
            <p>
              <span>{item.author || 'Autoria não identificada'}</span>
              <span aria-hidden="true">·</span>
              <span>{item.year}</span>
              <span aria-hidden="true">·</span>
              <span>{item.pages} páginas no registro original</span>
            </p>
          </div>

          <div className="archive-reader__mast-actions">
            <span className={`archive-reader__access archive-reader__access--${isExclusive ? 'restricted' : 'open'}`}>
              {isExclusive ? <Shield size={14} aria-hidden="true" /> : <FileText size={14} aria-hidden="true" />}
              {isExclusive ? 'Consulta reservada' : 'Consulta aberta'}
            </span>
            {item.downloadUrl && (!isExclusive || hasAccess) && (
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={isExampleDownload ? 'Abrir PDF de exemplo (não contém esta obra)' : `Baixar fac-símile integral de ${item.title}`}
                className="archive-reader__download"
              >
                <Download size={15} aria-hidden="true" />
                <span>{isExampleDownload ? 'PDF de exemplo' : 'Baixar original'}</span>
              </a>
            )}
          </div>
        </header>

        {!hasAccess ? (
          <section className="archive-reader__gate" aria-labelledby="reader-gate-title">
            <div className="archive-reader__gate-copy">
              <h2 id="reader-gate-title">Assine para ler esta obra integral.</h2>
              <p>
                A assinatura dá acesso à coleção reservada, com visualização do fac-símile integral de {item.pages} páginas,
                folhas restauradas em alta definição e transcrições anotadas.
              </p>

              <dl className="archive-reader__gate-register">
                <div>
                  <dt>Fundo</dt>
                  <dd>{item.publisher || 'Arquivo Adversus Omnes'}</dd>
                </div>
                <div>
                  <dt>Período</dt>
                  <dd>{item.period}</dd>
                </div>
                <div>
                  <dt>Movimento</dt>
                  <dd>{item.politicalMovement}</dd>
                </div>
              </dl>

              <div className="archive-reader__gate-benefits">
                <h3>O plano inclui</h3>
                <ul>
                  <li>acesso irrestrito ao fac-símile integral de todas as páginas ({item.pages} págs);</li>
                  <li>folhas em alta resolução e transcrição textual acessível;</li>
                  <li>marca nominal de proveniência vinculada à sua conta;</li>
                  <li>download direto do documento em alta fidelidade.</li>
                </ul>
              </div>

              <div className="archive-reader__gate-actions">
                <button
                  type="button"
                  onClick={() => preferredPlan && startSubscriptionCheckout(preferredPlan)}
                  disabled={!preferredPlan}
                >
                  <span>Assinar para ler</span>
                  {preferredPlan && <small>{preferredPlan.name}{planPrice ? ` · ${planPrice}/mês` : ''}</small>}
                </button>
                <button type="button" onClick={handleBack}>
                  Consultar o acervo aberto
                </button>
              </div>
              <p className="archive-reader__demo-note">Demonstração de assinatura. Nenhuma cobrança real é realizada neste protótipo.</p>
            </div>
          </section>
        ) : (
          <section
            ref={viewerContainerRef}
            className={`archive-reader__workspace ${isFullscreen ? 'archive-reader__workspace--fullscreen' : ''}`}
            aria-label={`Leitor de ${item.title}`}
          >
            {/* Drawer móvel de Índice e Ficha Catalográfica */}
            {isIndexOpen && (
              <div
                className="archive-reader__drawer-backdrop"
                onClick={() => setIsIndexOpen(false)}
                role="presentation"
              >
                <div
                  className="archive-reader__drawer"
                  onClick={e => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Índice da Obra e Ficha Catalográfica"
                >
                  <div className="archive-reader__drawer-head">
                    <div className="archive-reader__drawer-title">
                      <BookOpen size={18} className="text-rubrica" aria-hidden="true" />
                      <div>
                        <h3>Índice da Obra</h3>
                        <span>{totalPages} folhas catalogadas</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsIndexOpen(false)}
                      className="archive-reader__drawer-close"
                      aria-label="Fechar índice"
                    >
                      <X size={20} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="archive-reader__drawer-body">
                    {/* Folhas de Destaque */}
                    <section className="archive-reader__drawer-section" aria-labelledby="drawer-leaves-heading">
                      <h4 id="drawer-leaves-heading" className="archive-reader__drawer-section-title">
                        Folhas Restauradas
                      </h4>
                      <nav className="archive-reader__drawer-nav" aria-label="Folhas da obra">
                        <ol>
                          {pages.map((page, index) => {
                            const isActive = currentPage === index + 1 && viewMode !== 'document';
                            return (
                              <li key={`drawer-${page.pageNumber}-${page.title}`}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentPage(index + 1);
                                    if (viewMode === 'document') setViewMode('facsimile');
                                    setIsIndexOpen(false);
                                  }}
                                  className={`archive-reader__drawer-leaf ${isActive ? 'archive-reader__drawer-leaf--active' : ''}`}
                                  aria-current={isActive ? 'page' : undefined}
                                >
                                  <span className="archive-reader__drawer-leaf-num">
                                    {String(page.pageNumber).padStart(2, '0')}
                                  </span>
                                  <strong className="archive-reader__drawer-leaf-title">
                                    {page.title}
                                  </strong>
                                </button>
                              </li>
                            );
                          })}
                        </ol>
                      </nav>
                    </section>

                    {/* Ficha catalográfica */}
                    <section className="archive-reader__drawer-section" aria-labelledby="drawer-meta-heading">
                      <h4 id="drawer-meta-heading" className="archive-reader__drawer-section-title">
                        Ficha Catalográfica
                      </h4>
                      <dl className="archive-reader__drawer-meta">
                        <div><dt>Registro</dt><dd>{item.id.toUpperCase()}</dd></div>
                        <div><dt>Autoria</dt><dd>{item.author || 'Não identificada'}</dd></div>
                        <div><dt>Datação</dt><dd>{item.year}</dd></div>
                        <div><dt>Fundo</dt><dd>{item.publisher || 'Arquivo Adversus Omnes'}</dd></div>
                        <div><dt>Movimento</dt><dd>{item.politicalMovement}</dd></div>
                        {item.event && <div><dt>Contexto</dt><dd>{item.event}</dd></div>}
                        <div><dt>Extensão</dt><dd>{item.pages} páginas no registro original</dd></div>
                      </dl>
                    </section>

                    {/* Aviso de Edição */}
                    <div className="archive-reader__drawer-notice">
                      <p>
                        {documentEmbedUrl
                          ? `Volume integral com ${item.pages} páginas preservadas. Use o modo "Folhas Restauradas" para altíssima resolução ou "Documento Integral" para navegar no volume completo.`
                          : 'Documento histórico preservado no acervo digital de consulta restrita.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha & Índice na barra lateral (Desktop) */}
            <aside className="archive-reader__catalogue hidden lg:flex" aria-label="Ficha catalográfica e páginas">
              <details className="archive-reader__disclosure">
                <summary>Ficha da obra</summary>
                <dl className="archive-reader__metadata">
                  <div><dt>Registro</dt><dd>{item.id.toUpperCase()}</dd></div>
                  <div>
                    <dt>Autoria</dt>
                    <dd>{item.author || 'Não identificada'}</dd>
                  </div>
                  <div>
                    <dt>Datação</dt>
                    <dd>{item.year}</dd>
                  </div>
                  <div>
                    <dt>Fundo / edição</dt>
                    <dd>{item.publisher || 'Arquivo Adversus Omnes'}</dd>
                  </div>
                  <div>
                    <dt>Classificação</dt>
                    <dd>{item.politicalMovement}</dd>
                  </div>
                  {item.event && (
                    <div>
                      <dt>Contexto</dt>
                      <dd>{item.event}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Extensão</dt>
                    <dd>{item.pages} páginas no registro original</dd>
                  </div>
                </dl>
              </details>

              <details className="archive-reader__disclosure" open>
                <summary>Índice · {totalPages} folhas de destaque</summary>
                <nav className="archive-reader__leaves" aria-label="Páginas disponíveis nesta seleção">
                  <ol>
                    {pages.map((page, index) => (
                      <li key={`${page.pageNumber}-${page.title}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage(index + 1);
                            if (viewMode === 'document') setViewMode('facsimile');
                          }}
                          aria-current={currentPage === index + 1 && viewMode !== 'document' ? 'page' : undefined}
                        >
                          <span>{String(page.pageNumber).padStart(2, '0')}</span>
                          <strong>{page.title}</strong>
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>

              <details className="archive-reader__disclosure">
                <summary>Sobre esta edição</summary>
                <div className="archive-reader__notice">
                  <p>
                    {documentEmbedUrl
                      ? `Obra completa preservada (${item.pages} páginas). O modo "Documento Integral" exibe o fac-símile original completo. O modo "Folhas Restauradas" apresenta as páginas de destaque em alta definição.`
                      : 'Documento histórico preservado no acervo digital. Consulte as folhas fac-similares ou a transcrição textual.'}
                    {' '}
                    {isExclusive
                      ? 'As páginas recebem marca d\'água de proveniência nominal vinculada ao usuário.'
                      : 'Documento aberto ao público.'}
                  </p>
                </div>
              </details>
            </aside>

            <div className="archive-reader__surface">
              <div className="archive-reader__toolbar" role="toolbar" aria-label="Ferramentas de leitura">
                {/* Grupo de modos de exibição + botão de índice */}
                <div className="archive-reader__toolbar-group archive-reader__toolbar-group--modes">
                  <div className="archive-reader__mode-tabs" role="tablist" aria-label="Modo de visualização">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === 'facsimile'}
                      onClick={() => setViewMode('facsimile')}
                      className={`archive-reader__tab-btn ${viewMode === 'facsimile' ? 'archive-reader__tab-btn--active' : ''}`}
                      title="Ver folhas restauradas em alta resolução"
                    >
                      <ImageIcon size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Folhas Restauradas</span>
                      <span className="sm:hidden">Folhas</span>
                    </button>
                    {documentEmbedUrl && (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={viewMode === 'document'}
                        onClick={() => setViewMode('document')}
                        className={`archive-reader__tab-btn ${viewMode === 'document' ? 'archive-reader__tab-btn--active' : ''}`}
                        title="Ver o livro integral com todas as páginas escaneadas"
                      >
                        <BookOpen size={14} aria-hidden="true" />
                        <span className="hidden sm:inline">Documento Integral</span>
                        <span className="sm:hidden">Integral</span>
                      </button>
                    )}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === 'text'}
                      onClick={() => setViewMode('text')}
                      className={`archive-reader__tab-btn ${viewMode === 'text' ? 'archive-reader__tab-btn--active' : ''}`}
                      title="Ler transcrição em texto acessível"
                    >
                      <Type size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Texto OCR</span>
                      <span className="sm:hidden">Texto</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsIndexOpen(true)}
                    className="archive-reader__index-btn"
                    title="Abrir índice da obra e ficha"
                    aria-label={`Abrir índice da obra com ${totalPages} folhas`}
                  >
                    <List size={14} aria-hidden="true" />
                    <span>Índice</span>
                    <span className="archive-reader__index-badge">{totalPages}</span>
                  </button>
                </div>

                {/* Grupo 2: Navegação + Ferramentas (Zoom & Tela Cheia) */}
                <div className="archive-reader__toolbar-group archive-reader__toolbar-group--actions">
                  {viewMode !== 'document' ? (
                    <div className="archive-reader__page-controls" role="group" aria-label="Navegação entre páginas">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(previous => Math.max(1, previous - 1))}
                        aria-label="Página anterior"
                      >
                        <ChevronLeft size={16} aria-hidden="true" />
                      </button>
                      <span className="archive-reader__page-count" aria-live="polite">
                        <span>Folha</span>
                        <strong>{String(currentPage).padStart(2, '0')}</strong>
                        <span>de {String(totalPages).padStart(2, '0')}</span>
                      </span>
                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(previous => Math.min(totalPages, previous + 1))}
                        aria-label="Próxima página"
                      >
                        <ChevronRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="archive-reader__document-meta-inline flex items-center gap-2 text-xs text-[#a69882]">
                      <BookOpen size={14} className="text-rubrica shrink-0" />
                      <span className="truncate">{item.pages} págs digitalizadas</span>
                    </div>
                  )}

                  {/* Controles de Zoom & Tela cheia */}
                  <div className="archive-reader__tools">
                    {viewMode !== 'document' && (
                      <div className="archive-reader__zoom" role="group" aria-label="Ampliação da página">
                        <button
                          type="button"
                          disabled={zoom <= 80}
                          onClick={() => setZoom(previous => Math.max(80, previous - 20))}
                          aria-label="Diminuir zoom da leitura"
                        >
                          <ZoomOut size={14} aria-hidden="true" />
                        </button>
                        <output aria-live="polite">{zoom}%</output>
                        <button
                          type="button"
                          disabled={zoom >= 200}
                          onClick={() => setZoom(previous => Math.min(200, previous + 20))}
                          aria-label="Aumentar zoom da leitura"
                        >
                          <ZoomIn size={14} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
                      className="archive-reader__fullscreen"
                    >
                      {isFullscreen ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
                      <span className="hidden sm:inline">{isFullscreen ? 'Sair' : 'Tela cheia'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                ref={pageFrameRef}
                className={`archive-reader__stage ch-reader-stage ${isExclusive ? 'user-select-none' : ''}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {viewMode === 'document' && documentEmbedUrl ? (
                  <div className="archive-reader__integral-view w-full h-[78vh] min-h-[480px] flex flex-col bg-[#14110e] rounded border border-[#3d342a] overflow-hidden shadow-2xl">
                    <div className="archive-reader__integral-bar flex items-center justify-between px-3 py-2 bg-[#221c17] border-b border-[#3d342a] text-xs text-[#c9bca6]">
                      <div className="flex items-center gap-2 min-w-0">
                        <BookOpen size={14} className="text-rubrica shrink-0" />
                        <span className="font-serif font-bold text-[#e8ded0] truncate">{item.title}</span>
                        <span className="hidden sm:inline text-[#8a7a67] shrink-0">({item.pages} páginas originais)</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rubrica hover:underline flex items-center gap-1 font-medium text-xs"
                          >
                            <Download size={13} />
                            <span className="hidden sm:inline">Baixar fac-símile</span>
                            <span className="sm:hidden">Baixar</span>
                          </a>
                        )}
                        <a
                          href={documentEmbedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#a69882] hover:text-[#e8ded0] flex items-center gap-1 text-xs"
                          title="Abrir em nova aba"
                        >
                          <ExternalLink size={13} />
                          <span className="hidden sm:inline">Abrir em nova aba</span>
                        </a>
                      </div>
                    </div>

                    {/* Cartão de Ação Móvel para Google Drive */}
                    <div className="archive-reader__mobile-drive-card sm:hidden p-3 bg-[#1d1712] border-b border-[#3d342a] text-xs">
                      <p className="text-[#c9bca6] mb-2 leading-tight">
                        Para folhear as {item.pages} páginas com fluidez e tela cheia no celular:
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href={documentEmbedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="archive-reader__drive-btn archive-reader__drive-btn--primary flex-1 text-center py-2 px-3 rounded bg-rubrica text-white font-medium flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <ExternalLink size={14} />
                          <span>Abrir em Tela Cheia</span>
                        </a>
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="archive-reader__drive-btn archive-reader__drive-btn--secondary py-2 px-3 rounded border border-[#5a4d3e] text-[#e8ded0] font-medium flex items-center justify-center gap-1 min-h-[44px]"
                          >
                            <Download size={14} />
                            <span>Baixar</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <iframe
                      src={documentEmbedUrl}
                      title={`Documento integral de ${item.title}`}
                      className="w-full flex-1 border-0"
                      allow="autoplay"
                      loading="lazy"
                    />
                  </div>
                ) : viewMode === 'text' ? (
                  <div
                    key={`${item.id}-${currentPage}-texto`}
                    style={{
                      fontSize: `${zoom / 100}rem`
                    }}
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
                        Folha {currentPage} de {totalPages} · Ano {item.year} · Fundo:{' '}
                        {item.publisher || 'Arquivo Adversus Omnes'}
                        {isExclusive && ` · Licenciado para ${currentUser.name} (${currentUser.email})`}
                      </p>
                    </article>
                  </div>
                ) : (
                  <div
                    key={`${item.id}-${currentPage}-folha`}
                    style={{
                      ...(transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : {})
                    }}
                    className="ch-reader-sheet"
                  >
                    <canvas
                      ref={canvasRef}
                      role="img"
                      aria-label={`Página ${currentPage} de ${totalPages} de ${item.title}, reprodução fac-similar da folha original.`}
                      className="archive-reader__canvas"
                    />

                    <div className="sr-only">
                      <h2>{item.title}</h2>
                      <h3>{activePage.title}</h3>
                      <p>{activePage.content}</p>
                    </div>

                    {isExclusive && (
                      <div className="archive-reader__license">
                        Licenciado para {currentUser.name} · {currentUser.email}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Barra inferior ergonômica para leitura em celulares */}
              {viewMode !== 'document' && (
                <div className="archive-reader__mobile-bottom-bar md:hidden" role="navigation" aria-label="Navegação rápida de folha">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(previous => Math.max(1, previous - 1))}
                    className="archive-reader__mobile-nav-btn"
                    aria-label="Folha anterior"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsIndexOpen(true)}
                    className="archive-reader__mobile-page-indicator"
                    aria-label={`Folha ${currentPage} de ${totalPages}. Toque para abrir sumário.`}
                  >
                    <span className="archive-reader__mobile-indicator-label">Folha</span>
                    <strong className="archive-reader__mobile-indicator-current">{String(currentPage).padStart(2, '0')}</strong>
                    <span className="archive-reader__mobile-indicator-total">/ {String(totalPages).padStart(2, '0')}</span>
                    <List size={13} className="text-rubrica ml-1" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(previous => Math.min(totalPages, previous + 1))}
                    className="archive-reader__mobile-nav-btn"
                    aria-label="Próxima folha"
                  >
                    <span>Próxima</span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
