import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Lock,
  Shield,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
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

  // Security restrictions when exclusive
  useEffect(() => {
    if (!isExclusive) return;

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
  }, [isExclusive]);

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

    // Background: parchment paper texture feel
    ctx.fillStyle = '#fdfbf6';
    ctx.fillRect(0, 0, 800, 1100);

    // Border line
    ctx.strokeStyle = '#d8ccb4';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 1040);
    ctx.strokeRect(34, 34, 732, 1032);

    // Page header
    ctx.fillStyle = '#68573d';
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `ADVERSUS OMNES — BIBLIOTHECA ET ARCHIVUM`,
      400,
      60
    );

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
    ctx.font = 'bold 22px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    let titleY = 110;
    for (const line of wrap(item.title.toUpperCase(), 620)) {
      ctx.fillText(line, 400, titleY);
      titleY += 28;
    }

    const afterTitle = titleY + 2;

    ctx.fillStyle = '#b8311a';
    ctx.font = '600 13px "Cinzel", serif';
    ctx.fillText(item.author || 'Arquivo Histórico', 400, afterTitle);

    // Filete de rubrica sob a assinatura
    ctx.strokeStyle = '#b8311a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(320, afterTitle + 15);
    ctx.lineTo(480, afterTitle + 15);
    ctx.stroke();

    // Section title
    ctx.fillStyle = '#4a4236';
    ctx.font = 'italic bold 16px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'left';
    const sectionY = afterTitle + 65;
    ctx.fillText(activePageData.title, 70, sectionY);

    // Body content wrapped
    ctx.fillStyle = '#14110e';
    ctx.font = '15px/1.8 "Cormorant Garamond", Georgia, serif';
    
    const words = activePageData.content.split(' ');
    let line = '';
    let y = sectionY + 40;
    const maxWidth = 660;
    const lineHeight = 28;

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

    // Archival metadata footer in canvas
    ctx.fillStyle = '#68573d';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Página ${currentPage} de ${totalPages} • Ano: ${item.year} • Proveniência: ${item.publisher || 'Arquivo Adversus Omnes'}`,
      400,
      1030
    );

    // Security Canvas Watermark for Exclusive Content
    if (isExclusive) {
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      ctx.fillStyle = 'rgba(184, 49, 26, 0.07)';
      ctx.font = 'bold 16px sans-serif';
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
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-paper-400 py-6 px-3 sm:px-6">
      {/* Alert toast when copy is blocked */}
      {copiedAlert && (
        <div
          role="alert"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rubrica-tint/95 border border-rubrica text-rubrica-deep px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-semibold"
        >
          <ShieldAlert className="text-rubrica w-5 h-5 shrink-0" aria-hidden="true" />
          <span>
            Aviso de Proteção: A extração de texto, atalhos de cópia e impressão estão bloqueados para este documento exclusivo de assinantes.
          </span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top bar with back button & item summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-paper-700 border border-rule-faint rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                onBack();
                setTimeout(() => setTransitioningCoverId(null), 480);
              }}
              aria-label="Voltar para a lista do acervo"
              className="px-3 py-2 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft hover:text-ink transition flex items-center gap-1.5 text-xs font-medium min-h-[44px] shrink-0 whitespace-nowrap"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="sm:hidden">Voltar</span>
              <span className="hidden sm:inline">Voltar ao Acervo</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-cinzel font-bold text-ink line-clamp-1">
                  {item.title}
                </h1>
                {isExclusive ? (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-ocre-tint text-rubrica border border-ocre/35 flex items-center gap-1 shrink-0">
                    <Shield size={11} aria-hidden="true" /> Exclusivo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-verdete-tint text-verdete border border-verdete/35 flex items-center gap-1 shrink-0">
                    <FileText size={11} aria-hidden="true" /> Domínio Público
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-soft font-serif italic truncate mt-0.5">
                {item.author} ({item.year}) • {item.pages} páginas
              </p>
            </div>
          </div>

          {/* Download button for free documents */}
          {!isExclusive && item.downloadUrl && (
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Baixar PDF completo de ${item.title}`}
              className="px-4 py-2.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-semibold text-xs transition flex items-center gap-2 self-start sm:self-auto shadow-md min-h-[44px]"
            >
              <Download size={15} aria-hidden="true" />
              <span>Baixar PDF Completo</span>
            </a>
          )}
        </div>

        {/* Access check / Paywall */}
        {!hasAccess ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-paper-700 to-paper-600 border border-rule text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-ocre-tint/80 border border-rubrica/50 text-rubrica flex items-center justify-center mx-auto shadow-lg">
              <Lock size={32} aria-hidden="true" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-cinzel font-bold text-ink">
                Material Restrito a Membros Assinantes
              </h2>
              <p className="text-sm leading-relaxed text-ink-soft">
                Este documento faz parte da coleção reservada de <strong>Adversus Omnes</strong>. A
                assinatura abre o acervo digital completo no leitor protegido, com a ficha de
                proveniência de cada peça.
              </p>
            </div>

            <div className="p-4 max-w-lg mx-auto bg-paper-600 border border-rule rounded-xl text-left text-xs space-y-2 text-ink-soft">
              <div className="font-semibold text-ocre flex items-center gap-1.5">
                <Sparkles size={14} aria-hidden="true" /> Vantagens da Assinatura:
              </div>
              <ul className="space-y-1 text-ink-soft">
                <li>• Acervo digital completo, incluindo os documentos reservados a assinantes</li>
                <li>• Leitor protegido com marca de proveniência e modo de texto acessível</li>
                <li>• 15% a 20% de desconto em todo o acervo físico</li>
                <li>• Ensaios e notas de pesquisa exclusivos do clube</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => startSubscriptionCheckout(plans[1] || plans[0])}
                className="px-6 py-3.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-bold text-sm transition shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Assinar Plano Pesquisador (R$ 59,90/mês)</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3.5 rounded-lg bg-paper-400 text-ink-soft text-sm hover:bg-paper-300 transition min-h-[44px]"
              >
                Explorar Acervo Aberto
              </button>
            </div>
          </div>
        ) : (
          /* Authorized Reader Canvas with Security Controls */
          <div
            ref={viewerContainerRef}
            className={`bg-paper-600 border border-rule rounded-xl overflow-hidden shadow-2xl flex flex-col ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
            }`}
          >
            {/* Reader Toolbar */}
            <div className="bg-paper-700 px-4 py-2.5 border-b border-rule-faint flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Pagination controls with 44px min-touch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  aria-label="Página anterior"
                  className="p-2.5 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft disabled:opacity-40 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className="text-ink-soft font-medium">
                  Pág. <strong className="text-ink">{currentPage}</strong> de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  aria-label="Próxima página"
                  className="p-2.5 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft disabled:opacity-40 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Security indicator for exclusive */}
              {isExclusive && (
                <div
                  className="flex items-center gap-2 rounded-full border border-ocre/35 bg-ocre-tint/40 px-3 py-1.5 text-[11px] text-ocre"
                  title="A página é desenhada em tela e marcada com sua identidade. Isso dificulta a extração casual, mas não impede captura de tela."
                >
                  <Shield size={13} className="text-rubrica" aria-hidden="true" />
                  <span>Leitor protegido • página marcada com sua identidade</span>
                </div>
              )}

              {/* Zoom & Screen Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.max(70, prev - 15))}
                  aria-label="Diminuir zoom da leitura"
                  className="p-2.5 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ZoomOut size={16} aria-hidden="true" />
                </button>
                <span className="text-ink-soft w-12 text-center">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.min(150, prev + 15))}
                  aria-label="Aumentar zoom da leitura"
                  className="p-2.5 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ZoomIn size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextMode(v => !v)}
                  aria-pressed={textMode}
                  aria-label={textMode ? 'Ver a página desenhada' : 'Ler em texto acessível'}
                  title={textMode ? 'Ver a página desenhada' : 'Ler em texto acessível'}
                  className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 transition ${
                    textMode
                      ? 'bg-rubrica text-paper-800'
                      : 'bg-paper-600 text-ink-soft hover:bg-paper-300'
                  }`}
                >
                  {textMode ? <ImageIcon size={16} aria-hidden="true" /> : <Type size={16} aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
                  className="p-2.5 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink-soft ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Maximize2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Página: desenhada em tela, ou em texto corrido quando pedido */}
            <div
              ref={pageFrameRef}
              className={`ch-reader-stage flex-1 overflow-auto p-2 sm:p-8 flex justify-center items-start sm:items-center user-select-none max-w-full ${
                isExclusive ? 'select-none pointer-events-auto' : ''
              }`}
            >
              <div
                style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                className={`ch-reader-sheet relative max-w-full overflow-hidden ${
                  textMode ? 'w-full' : ''
                }`}
              >
                {textMode ? (
                  <article className="ch-reader-page">
                    <p className="ch-reader-kicker">
                      Adversus Omnes — Bibliotheca et Archivum
                    </p>
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
                      aria-label={`Página ${currentPage} de ${totalPages} de ${item.title}, desenhada em tela. Use "Ler em texto acessível" na barra do leitor para o conteúdo em texto.`}
                      className="mx-auto block h-auto max-w-full rounded transition-transform"
                    />

                    {/* O conteúdo da página também chega a quem lê por leitor de
                        tela, sem alterar a composição visual. */}
                    <div className="sr-only">
                      <h2>{item.title}</h2>
                      <h3>{activePage.title}</h3>
                      <p>{activePage.content}</p>
                    </div>

                    {isExclusive && (
                      <div className="pointer-events-none absolute bottom-1.5 left-0 right-0 truncate px-2 text-center font-mono text-xs text-ink-faint">
                        Licenciado para: {currentUser.name} ({currentUser.email})
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
