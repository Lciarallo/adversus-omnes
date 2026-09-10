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
  Eye,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatalogItem } from '../types';

interface DigitalViewerProps {
  item: CatalogItem;
  onBack: () => void;
}

export const DigitalViewer: React.FC<DigitalViewerProps> = ({ item, onBack }) => {
  const { currentUser, plans, startSubscriptionCheckout } = useStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  const pages = item.pdfPages || [
    {
      pageNumber: 1,
      title: item.title,
      content: item.description
    }
  ];

  const totalPages = pages.length;
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
    if (!hasAccess) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = (zoom / 100) * 2; // high-DPI scaling
    const width = 800 * (zoom / 100);
    const height = 1100 * (zoom / 100);

    canvas.width = 800 * scale;
    canvas.height = 1100 * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(scale, scale);

    // Background: parchment paper texture feel
    ctx.fillStyle = '#fbf9f2';
    ctx.fillRect(0, 0, 800, 1100);

    // Border line
    ctx.strokeStyle = '#d9d2c2';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 1040);
    ctx.strokeRect(34, 34, 732, 1032);

    // Page header
    ctx.fillStyle = '#6e6a5e';
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `BIBLIOTECA CONTRASTE — ACERVO HISTÓRICO PRESERVADO`,
      400,
      60
    );

    // Document Title
    const activePageData = pages[currentPage - 1] || pages[0];
    ctx.fillStyle = '#1c1c1a';
    ctx.font = 'bold 22px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.title.toUpperCase(), 400, 110);

    ctx.fillStyle = '#8f7e53';
    ctx.font = '600 13px "Cinzel", serif';
    ctx.fillText(item.author || 'Arquivo Histórico', 400, 135);

    // Thin separator line
    ctx.strokeStyle = '#c89b3c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(320, 150);
    ctx.lineTo(480, 150);
    ctx.stroke();

    // Section title
    ctx.fillStyle = '#3a3832';
    ctx.font = 'italic bold 16px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(activePageData.title, 70, 200);

    // Body content wrapped
    ctx.fillStyle = '#232220';
    ctx.font = '15px/1.8 "Cormorant Garamond", Georgia, serif';
    
    const words = activePageData.content.split(' ');
    let line = '';
    let y = 240;
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
    ctx.fillStyle = '#8a8577';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Página ${currentPage} de ${totalPages} • Ano: ${item.year} • Proveniência: ${item.publisher || 'Arquivo Contraste'}`,
      400,
      1030
    );

    // Security Canvas Watermark for Exclusive Content
    if (isExclusive) {
      ctx.save();
      ctx.rotate((-25 * Math.PI) / 180);
      ctx.fillStyle = 'rgba(180, 140, 50, 0.09)';
      ctx.font = 'bold 16px sans-serif';
      const watermarkText = `CONTRASTE • ${currentUser.name.toUpperCase()} (${currentUser.email}) • USO EXCLUSIVO • CÓPIA PROIBIDA`;
      for (let wx = -400; wx < 1200; wx += 450) {
        for (let wy = -200; wy < 1400; wy += 140) {
          ctx.fillText(watermarkText, wx, wy);
        }
      }
      ctx.restore();
    }
  }, [item, currentPage, zoom, hasAccess, currentUser, isExclusive, totalPages, pages]);

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch(err => alert(err.message));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] py-6 px-3 sm:px-6">
      {/* Alert toast when copy is blocked */}
      {copiedAlert && (
        <div
          role="alert"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-950/95 border border-red-500 text-red-200 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-semibold"
        >
          <ShieldAlert className="text-red-400 w-5 h-5 shrink-0" aria-hidden="true" />
          <span>
            Aviso de Proteção: A extração de texto, atalhos de cópia e impressão estão bloqueados para este documento exclusivo de assinantes.
          </span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top bar with back button & item summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#14161c] border border-[#262934] rounded-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Voltar para a lista do acervo"
              className="p-2.5 rounded-lg bg-[#1e212b] hover:bg-[#2a2e3c] text-stone-300 hover:text-white transition flex items-center gap-1.5 text-xs font-medium min-h-[44px]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Voltar ao Acervo</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-cinzel font-bold text-white truncate max-w-md">
                  {item.title}
                </h1>
                {isExclusive ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-[#c89b3c] border border-amber-800/40 flex items-center gap-1 shrink-0">
                    <Shield size={11} aria-hidden="true" /> Exclusivo Assinante
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1 shrink-0">
                    <FileText size={11} aria-hidden="true" /> Domínio Público
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-serif italic">
                {item.author} ({item.year}) • {item.pages} páginas catalogadas
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
              className="px-4 py-2.5 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition flex items-center gap-2 self-start sm:self-auto shadow-md min-h-[44px]"
            >
              <Download size={15} aria-hidden="true" />
              <span>Baixar PDF Completo</span>
            </a>
          )}
        </div>

        {/* Access check / Paywall */}
        {!hasAccess ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-[#181a22] to-[#121317] border border-[#2f3342] text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-[#c89b3c]/50 text-[#c89b3c] flex items-center justify-center mx-auto shadow-lg">
              <Lock size={32} aria-hidden="true" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-cinzel font-bold text-white">
                Material Restrito a Membros Assinantes
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Este fac-símile, ata inédita e seus manuscritos associados fazem parte da coleção reservada da <strong>Biblioteca Contraste</strong>. Para consultar o documento completo com leitor de alta definição protegido, torne-se um membro assinante.
              </p>
            </div>

            <div className="p-4 max-w-lg mx-auto bg-[#1a1d26] border border-[#2b2f3e] rounded-xl text-left text-xs space-y-2 text-stone-300">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} aria-hidden="true" /> Vantagens da Assinatura:
              </div>
              <ul className="space-y-1 text-stone-400">
                <li>• Acesso ilimitado a centenas de documentos raros e cartas históricas</li>
                <li>• Leitor com renderização vetorial e proteção de proveniência</li>
                <li>• Descontos de 15% a 20% em todo o nosso acervo físico de livros</li>
                <li>• Envio de relatórios bibliográficos e ensaios exclusivos</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => startSubscriptionCheckout(plans[1] || plans[0])}
                className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#a87e28] hover:from-[#d9ab4b] hover:to-[#b88c32] text-black font-bold text-sm transition shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Assinar Plano Pesquisador (R$ 59,90/mês)</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3.5 rounded-lg bg-[#222530] text-stone-300 text-sm hover:bg-[#2b2f3d] transition min-h-[44px]"
              >
                Explorar Acervo Aberto
              </button>
            </div>
          </div>
        ) : (
          /* Authorized Reader Canvas with Security Controls */
          <div
            ref={viewerContainerRef}
            className={`bg-[#121317] border border-[#282b37] rounded-xl overflow-hidden shadow-2xl flex flex-col ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
            }`}
          >
            {/* Reader Toolbar */}
            <div className="bg-[#181a22] px-4 py-2.5 border-b border-[#252834] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Pagination controls with 44px min-touch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  aria-label="Página anterior"
                  className="p-2.5 rounded-lg bg-[#20232d] hover:bg-[#2a2e3a] text-stone-300 disabled:opacity-40 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className="text-stone-300 font-medium">
                  Pág. <strong className="text-white">{currentPage}</strong> de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  aria-label="Próxima página"
                  className="p-2.5 rounded-lg bg-[#20232d] hover:bg-[#2a2e3a] text-stone-300 disabled:opacity-40 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Security indicator for exclusive */}
              {isExclusive && (
                <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/30 px-3 py-1.5 rounded-full">
                  <Shield size={13} className="text-[#c89b3c]" aria-hidden="true" />
                  <span>Leitor Protegido Ativo • Extração e Cópia Bloqueadas</span>
                </div>
              )}

              {/* Zoom & Screen Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.max(70, prev - 15))}
                  aria-label="Diminuir zoom da leitura"
                  className="p-2.5 rounded-lg bg-[#20232d] hover:bg-[#2a2e3a] text-stone-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ZoomOut size={16} aria-hidden="true" />
                </button>
                <span className="text-stone-400 w-12 text-center">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.min(150, prev + 15))}
                  aria-label="Aumentar zoom da leitura"
                  className="p-2.5 rounded-lg bg-[#20232d] hover:bg-[#2a2e3a] text-stone-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ZoomIn size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
                  className="p-2.5 rounded-lg bg-[#20232d] hover:bg-[#2a2e3a] text-stone-300 ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Maximize2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Canvas Viewer Container */}
            <div
              className={`flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-center bg-[#090a0d] user-select-none ${
                isExclusive ? 'select-none pointer-events-auto' : ''
              }`}
            >
              <div className="relative shadow-2xl border border-stone-800 rounded bg-[#fbf9f2]">
                <canvas
                  ref={canvasRef}
                  aria-label={`Visualização gráfica da página ${currentPage} de ${item.title}`}
                  className="block mx-auto rounded transition-transform"
                />

                {isExclusive && (
                  <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none text-[10px] text-stone-400/60 font-mono">
                    Licenciado para: {currentUser.name} ({currentUser.email}) • Sessão Antigravity ID #2026-BC
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
