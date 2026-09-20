import React, { useState } from 'react';
import {
  Scroll,
  Download,
  Shield,
  Eye,
  Search,
  Lock,
  Sparkles,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatalogItem } from '../types';

export const DigitalCatalog: React.FC = () => {
  const { catalog, openReader, currentUser, plans, startSubscriptionCheckout, transitioningCoverId } = useStore();

  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'exclusive'>('all');
  const [movementFilter, setMovementFilter] = useState('all');

  // Digital items (digital + historical_doc)
  const digitalItems = catalog.filter(c => c.type === 'digital' || c.type === 'historical_doc');

  const movements = Array.from(new Set(digitalItems.map(c => c.politicalMovement).filter(Boolean)));

  const filteredItems = digitalItems.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchAccess = accessFilter === 'all' || item.access === accessFilter;
    const matchMovement = movementFilter === 'all' || item.politicalMovement === movementFilter;

    return matchSearch && matchAccess && matchMovement;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="border-b border-[#262936] pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
          Acervo Digital e Arquivo Histórico
        </h1>
        <p className="text-stone-400 font-serif italic text-sm sm:text-base max-w-3xl leading-relaxed">
          Preservação digital de manifestos republicanos, cartas clandestinas, atas secretas de convenções e ensaios inéditos. Conteúdos de domínio público com download livre e materiais restritos protegidos para assinantes.
        </p>
      </div>

      {/* Banner informing about protected reader */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#1a1d26] to-[#14161f] border border-[#2b3040] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-[#c89b3c] shrink-0">
            <Shield size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Tecnologia de Visualização Segura (DRM-Lite)
            </h2>
            <p className="text-xs text-stone-400">
              O leitor do acervo exclusivo renderiza as páginas em tela bloqueando download de arquivo bruto, atalhos de impressão e extração textual não autorizada.
            </p>
          </div>
        </div>

        {currentUser.role !== 'subscriber' && currentUser.role !== 'admin' && (
          <button
            type="button"
            onClick={() => startSubscriptionCheckout(plans[1] || plans[0])}
            className="px-4 py-2.5 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs whitespace-nowrap transition shadow-md min-h-[44px]"
          >
            Assinar e Liberar Acesso
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[#15171e] p-4 rounded-xl border border-[#272b38] grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dust pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Buscar documentos por título, autor ou evento histórico"
            placeholder="Buscar por título, autor ou evento histórico..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-[#101217] border border-[#2e3343] rounded-lg text-xs text-white placeholder-dust focus:outline-none focus:border-[#c89b3c] min-h-[44px]"
          />
        </div>

        {/* Access type */}
        <div>
          <select
            aria-label="Filtrar por tipo de acesso (Livre ou Exclusivo)"
            value={accessFilter}
            onChange={e => setAccessFilter(e.target.value as any)}
            className="w-full bg-[#101217] border border-[#2e3343] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c89b3c] min-h-[44px]"
          >
            <option value="all">Todos os Tipos de Acesso</option>
            <option value="free">Livre para Download (PDF Aberto)</option>
            <option value="exclusive">Exclusivo para Assinantes (Protegido)</option>
          </select>
        </div>

        {/* Movement */}
        <div>
          <select
            aria-label="Filtrar documentos por movimento político"
            value={movementFilter}
            onChange={e => setMovementFilter(e.target.value)}
            className="w-full bg-[#101217] border border-[#2e3343] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c89b3c] min-h-[44px]"
          >
            <option value="all">Todos os Movimentos Políticos</option>
            {movements.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Digital Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isExclusive = item.access === 'exclusive';
          const isUnlocked = !isExclusive || currentUser.role === 'subscriber' || currentUser.role === 'admin';

          return (
            <div
              key={item.id}
              className="bg-[#15171f] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg codex-card"
            >
              <div>
                <div className="relative h-60 bg-[#0b0c0e] p-3 flex items-center justify-center overflow-hidden border-b border-[#20232e]">
                  <img
                    src={item.coverImage}
                    alt={`Capa do documento ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                    className="max-h-full max-w-[80%] object-cover rounded shadow-xl border border-[#323644]"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isExclusive ? (
                      <span className="px-2.5 py-1 rounded bg-amber-950/90 text-[#c89b3c] border border-amber-800/60 text-[10px] font-mono font-medium flex items-center gap-1 shadow">
                        <Shield size={11} aria-hidden="true" /> Exclusivo Assinantes
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono font-medium flex items-center gap-1 shadow">
                        <Download size={11} aria-hidden="true" /> PDF Livre / Baixar
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                    <span>{item.period}</span>
                    <span>•</span>
                    <span>Ano: {item.year}</span>
                    <span>•</span>
                    <span>{item.pages} págs</span>
                  </div>

                  <h3
                    tabIndex={0}
                    role="button"
                    onClick={() => openReader(item)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openReader(item);
                      }
                    }}
                    className="text-base font-cinzel font-bold text-white group-hover:text-[#c89b3c] cursor-pointer transition line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#c89b3c] font-medium font-serif italic">
                    {item.author}
                  </p>

                  <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed font-serif">
                    {item.description}
                  </p>

                  {item.event && (
                    <div className="text-[10px] text-stone-400 bg-[#1b1e27] p-2 rounded-lg border border-[#272b38]">
                      <strong className="text-stone-300">Contexto:</strong> {item.event}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons with 44px min-height */}
              <div className="p-5 pt-3 border-t border-[#20232e] bg-[#12141a] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openReader(item)}
                  aria-label={`Abrir ${item.title} no leitor seguro`}
                  className="flex-1 min-h-[44px] py-2.5 px-3 rounded-lg bg-[#20232e] hover:bg-[#2b2f3e] text-stone-200 hover:text-white border border-[#34384a] text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Eye size={15} className="text-[#c89b3c]" aria-hidden="true" />
                  <span>{isExclusive && !isUnlocked ? 'Ver Prévia Protegida' : 'Abrir no Leitor'}</span>
                </button>

                {!isExclusive && item.downloadUrl && (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Baixar PDF original de ${item.title}`}
                    className="min-h-[44px] py-2.5 px-4 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download size={15} aria-hidden="true" />
                    <span>Baixar</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
