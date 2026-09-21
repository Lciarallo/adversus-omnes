import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Lock,
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
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatalogItem } from '../types';
import { useToast } from './ui/Toast';

interface DigitalViewerProps {
  item: CatalogItem;
  onBack: () => void;
}

export const DigitalViewer: React.FC<DigitalViewerProps> = ({ item, onBack }) => {
  const { currentUser, plans, startSubscriptionCheckout, transitioningCoverId, setTransitioningCoverId } = useStore();
  const { notify } = useToast();

  // O leitor dissuade a extração casual, mas o conteúdo do acervo não pode
  // ser inacessível a quem lê por leitor de tela ou precisa ampliar o texto.
  const [textMode, setTextMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const pageFrameRef = useRef<HTMLDivElement | null>(null);
  // Largura disponível para a página. A folha é desenhada num espaço fixo de
  // 800x1100, mas exibida na largura que couber: no celular, ajusta automaticamente
  // à largura da tela para visualização integral imediata sem corte.
  const [frameWidth, setFrameWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(800, Math.max(300, window.innerWidth - 32)) : 800
  );

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
  }, [isFullscreen]);

  const pages = item.pdfPages || [
    {
      pageNumber: 1,
      title: item.title,
      content: item.description
    }
  ];

  const totalPages = pages.length;
  const activePage = pages[currentPage - 1] || pages[0];
  const isExclusive = item.access === 'exclusive';
  const hasAccess = !isExclusive || currentUser.role === 'subscriber' || currentUser.role === 'admin';
  const preferredPlan = plans[1] || plans[0];
  const planPrice = preferredPlan
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preferredPlan.priceMonthly)
    : null;

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

  // Render text to canvas to prevent DOM text extraction
  useEffect(() => {
    if (!hasAccess || textMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Coordenadas de desenho seguem o espaço de página 800x1100; só a exibição
    // e a resolução do buffer acompanham a largura real disponível.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = frameWidth * (zoom / 100);
    const height = width * (1100 / 800);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const scale = (width / 800) * dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // A folha segue a materialidade clara do acervo, enquanto o entorno funciona
    // como mesa de exame. O desenho permanece em coordenadas editoriais fixas.
    ctx.fillStyle = '#fbf8f1';
    ctx.fillRect(0, 0, 800, 1100);

    // Moldura e cabeçalho de registro
    ctx.strokeStyle = '#d8ccb4';
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, 736, 1036);

    ctx.fillStyle = '#68573d';
    ctx.font = '600 10px "Cinzel", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('ADVERSUS OMNES · BIBLIOTHECA ET ARCHIVUM', 58, 64);
    ctx.textAlign = 'right';
    ctx.fillText(`COTA ${item.id.toUpperCase()}`, 742, 64);
    ctx.beginPath();
    ctx.moveTo(58, 82);
    ctx.lineTo(742, 82);
    ctx.stroke();

    // Título do documento: quebra em linhas dentro da própria folha.
    const activePageData = activePage;

    const wrap = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let current = '';
      for (const word of words) {
        const attempt = current ? `${current} ${word}` : word;
        if (ctx.measureText(attempt).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = attempt;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    ctx.fillStyle = '#14110e';
    ctx.font = '700 21px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    let titleY = 124;
    for (const line of wrap(item.title.toUpperCase(), 620)) {
      ctx.fillText(line, 400, titleY);
      titleY += 26;
    }

    const afterTitle = titleY + 4;

    ctx.fillStyle = '#b8311a';
    ctx.font = '600 11px "Cinzel", Georgia, serif';
    ctx.fillText(item.author || 'Arquivo Histórico', 400, afterTitle);

    ctx.strokeStyle = '#b8311a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(340, afterTitle + 17);
    ctx.lineTo(460, afterTitle + 17);
    ctx.stroke();

    // Identificação da folha e título da seção
    const sectionY = afterTitle + 72;
    ctx.fillStyle = '#b8311a';
    ctx.font = '600 10px "Cinzel", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`FÓLIO ${String(activePageData.pageNumber).padStart(2, '0')}`, 70, sectionY);

    ctx.fillStyle = '#28221c';
    ctx.font = 'italic 700 22px "Cormorant Garamond", Georgia, serif';
    let sectionTitleY = sectionY + 32;
    for (const line of wrap(activePageData.title, 640)) {
      ctx.fillText(line, 70, sectionTitleY);
      sectionTitleY += 27;
    }

    // Body content wrapped
    ctx.fillStyle = '#14110e';
    ctx.font = '17px "Spectral", Georgia, serif';
    
    const words = activePageData.content.split(' ');
    let line = '';
    let y = sectionTitleY + 22;
    const maxWidth = 640;
    const lineHeight = 31;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 70, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, y);

    // Colofão catalográfico
    ctx.strokeStyle = '#d8ccb4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(58, 1015);
    ctx.lineTo(742, 1015);
    ctx.stroke();

    ctx.fillStyle = '#68573d';
    ctx.font = '10px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    const provenance = item.publisher || 'Arquivo Adversus Omnes';
    const shortProvenance = provenance.length > 62 ? `${provenance.slice(0, 59)}…` : provenance;
    ctx.fillText(`${item.year} · ${shortProvenance}`, 58, 1043);
    ctx.textAlign = 'right';
    ctx.fillText(`PÁGINA ${currentPage} / ${totalPages}`, 742, 1043);

    // Security Canvas Watermark for Exclusive Content
    if (isExclusive) {
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      ctx.fillStyle = 'rgba(184, 49, 26, 0.07)';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      const watermarkText = `ADVERSUS OMNES • ${currentUser.name.toUpperCase()} (${currentUser.email}) • USO EXCLUSIVO • CÓPIA PROIBIDA`;
      for (let wx = -400; wx < 1200; wx += 450) {
        for (let wy = -200; wy < 1400; wy += 140) {
          ctx.fillText(watermarkText, wx, wy);
        }
      }
      ctx.restore();
    }
  }, [item, currentPage, zoom, hasAccess, textMode, currentUser, isExclusive, totalPages, activePage, frameWidth]);

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
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
  }, [currentPage, textMode]);

  return (
    <div className="archive-reader">
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
              <span>{item.pages} páginas no registro</span>
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
                aria-label={`Baixar fac-símile completo de ${item.title}`}
                className="archive-reader__download"
              >
                <Download size={15} aria-hidden="true" />
                <span>Baixar fac-símile</span>
              </a>
            )}
          </div>
        </header>

        {!hasAccess ? (
          <section className="archive-reader__gate" aria-labelledby="reader-gate-title">
            <div className="archive-reader__gate-preview" aria-hidden="true">
              <div className="archive-reader__gate-folio">
                <p>Adversus Omnes · Cota {item.id.toUpperCase()}</p>
                <h3>{item.title}</h3>
                <span>{item.author}</span>
                <div className="archive-reader__redactions">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="archive-reader__gate-stamp">
                  <Lock size={20} />
                  Acesso reservado
                </div>
              </div>
            </div>

            <div className="archive-reader__gate-copy">
              <span className="archive-reader__gate-lock" aria-hidden="true">
                <Lock size={22} />
              </span>
              <h2 id="reader-gate-title">Esta peça exige credencial de consulta.</h2>
              <p>
                O documento pertence à coleção reservada do Adversus Omnes. A assinatura libera a
                leitura integral disponível no protótipo, com marca nominal e alternativa em texto
                acessível.
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
                <h3>A credencial inclui</h3>
                <ul>
                  <li>acervo digital reservado e ensaios de pesquisa;</li>
                  <li>modo de leitura em tela e versão textual acessível;</li>
                  <li>marca de proveniência vinculada à conta;</li>
                  <li>benefícios previstos no plano para o acervo físico.</li>
                </ul>
              </div>

              <div className="archive-reader__gate-actions">
                <button
                  type="button"
                  onClick={() => preferredPlan && startSubscriptionCheckout(preferredPlan)}
                  disabled={!preferredPlan}
                >
                  <span>Solicitar credencial</span>
                  {preferredPlan && <small>{preferredPlan.name}{planPrice ? ` · ${planPrice}/mês` : ''}</small>}
                </button>
                <button type="button" onClick={handleBack}>
                  Consultar o acervo aberto
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section
            ref={viewerContainerRef}
            className={`archive-reader__workspace ${isFullscreen ? 'archive-reader__workspace--fullscreen' : ''}`}
            aria-label={`Leitor de ${item.title}`}
          >
            <aside className="archive-reader__catalogue" aria-label="Ficha catalográfica e páginas">
              <div className="archive-reader__catalogue-head">
                <h2>Ficha da peça</h2>
                <span>Cota {item.id.toUpperCase()}</span>
              </div>

              <dl className="archive-reader__metadata">
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
                  <dd>{item.pages} páginas no registro</dd>
                </div>
              </dl>

              <nav className="archive-reader__leaves" aria-label="Páginas disponíveis nesta leitura">
                <h3>Páginas nesta leitura</h3>
                <ol>
                  {pages.map((page, index) => (
                    <li key={`${page.pageNumber}-${page.title}`}>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(index + 1)}
                        aria-current={currentPage === index + 1 ? 'page' : undefined}
                      >
                        <span>{String(page.pageNumber).padStart(2, '0')}</span>
                        <strong>{page.title}</strong>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className={`archive-reader__notice archive-reader__notice--${isExclusive ? 'restricted' : 'open'}`}>
                {isExclusive ? <Shield size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
                <p>
                  {isExclusive
                    ? 'Camada dissuasória: a folha recebe marca nominal, mas capturas de tela continuam possíveis.'
                    : 'Documento aberto. A transcrição pode ser selecionada no modo de texto.'}
                </p>
              </div>
            </aside>

            <div className="archive-reader__surface">
              <div className="archive-reader__toolbar" role="toolbar" aria-label="Ferramentas de leitura">
                <div className="archive-reader__page-controls" role="group" aria-label="Navegação entre páginas">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(previous => Math.max(1, previous - 1))}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <span className="archive-reader__page-count" aria-live="polite">
                    <span>Página</span>
                    <strong>{String(currentPage).padStart(2, '0')}</strong>
                    <span>de {String(totalPages).padStart(2, '0')}</span>
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(previous => Math.min(totalPages, previous + 1))}
                    aria-label="Próxima página"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>

                <p className="archive-reader__active-leaf" title={activePage.title}>
                  {activePage.title}
                </p>

                <div className="archive-reader__tools">
                  <div className="archive-reader__zoom" role="group" aria-label="Ampliação da página">
                    <button
                      type="button"
                      disabled={zoom <= 70}
                      onClick={() => setZoom(previous => Math.max(70, previous - 15))}
                      aria-label="Diminuir zoom da leitura"
                    >
                      <ZoomOut size={16} aria-hidden="true" />
                    </button>
                    <output aria-live="polite">{zoom}%</output>
                    <button
                      type="button"
                      disabled={zoom >= 150}
                      onClick={() => setZoom(previous => Math.min(150, previous + 15))}
                      aria-label="Aumentar zoom da leitura"
                    >
                      <ZoomIn size={16} aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTextMode(value => !value)}
                    aria-pressed={textMode}
                    className={`archive-reader__mode ${textMode ? 'archive-reader__mode--active' : ''}`}
                  >
                    {textMode ? <ImageIcon size={16} aria-hidden="true" /> : <Type size={16} aria-hidden="true" />}
                    <span>{textMode ? 'Ver folha' : 'Texto acessível'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
                    className="archive-reader__fullscreen"
                  >
                    {isFullscreen ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
                    <span>{isFullscreen ? 'Sair' : 'Tela cheia'}</span>
                  </button>
                </div>
              </div>

              <div
                ref={pageFrameRef}
                className={`archive-reader__stage ch-reader-stage ${isExclusive ? 'user-select-none' : ''}`}
              >
                <div
                  key={`${item.id}-${currentPage}-${textMode ? 'texto' : 'folha'}`}
                  style={{
                    ...(transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : {}),
                    ...(textMode
                      ? {
                          width: `${frameWidth * (zoom / 100)}px`,
                          fontSize: `${zoom / 100}rem`
                        }
                      : {})
                  }}
                  className="ch-reader-sheet"
                >
                  {textMode ? (
                    <article className="ch-reader-page">
                      <h2 className="ch-reader-title">{item.title}</h2>
                      <p className="ch-reader-byline">{item.author || 'Arquivo Histórico'}</p>
                      <h3 className="ch-reader-section">{activePage.title}</h3>
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
                        Página {currentPage} de {totalPages} · Ano {item.year} · Proveniência:{' '}
                        {item.publisher || 'Arquivo Adversus Omnes'}
                        {isExclusive && ` · Licenciado para ${currentUser.name} (${currentUser.email})`}
                      </p>
                    </article>
                  ) : (
                    <>
                      <canvas
                        ref={canvasRef}
                        role="img"
                        aria-label={`Página ${currentPage} de ${totalPages} de ${item.title}, desenhada em tela. Use o controle Texto acessível para ler a transcrição.`}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
