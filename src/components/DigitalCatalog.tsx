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
import { EmptyState } from './ui/EmptyState';

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
      <div className="border-b border-rule-faint pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-ink tracking-wide">
          Acervo Digital e Arquivo Histórico
        </h1>
        <p className="text-ink-soft font-serif italic text-sm sm:text-base max-w-3xl leading-relaxed">
          Preservação digital de manifestos republicanos, cartas clandestinas, atas secretas de convenções e ensaios inéditos. Conteúdos de domínio público com download livre e materiais restritos protegidos para assinantes.
        </p>
      </div>

      {/* Banner informing about protected reader */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-paper-600 to-paper-700 border border-rule flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ocre-tint/80 border border-ocre/45 flex items-center justify-center text-rubrica shrink-0">
            <Shield size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Tecnologia de Visualização Segura (DRM-Lite)
            </h2>
            <p className="text-xs leading-relaxed text-ink-soft">
              O leitor desenha cada página em tela e a marca com a identidade do assinante, o que
              dificulta a extração casual. É dissuasão, não criptografia — e não impede captura de
              tela.
            </p>
          </div>
        </div>

        {currentUser.role !== 'subscriber' && currentUser.role !== 'admin' && (
          <button
            type="button"
            onClick={() => startSubscriptionCheckout(plans[1] || plans[0])}
            className="px-4 py-2.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-semibold text-xs whitespace-nowrap transition shadow-md min-h-[44px]"
          >
            Assinar e Liberar Acesso
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-paper-700 p-4 rounded-xl border border-rule grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Buscar documentos por título, autor ou evento histórico"
            placeholder="Buscar por título, autor ou evento histórico..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-paper-600 border border-rule rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-rubrica min-h-[44px]"
          />
        </div>

        {/* Access type */}
        <div>
          <select
            aria-label="Filtrar por tipo de acesso (Livre ou Exclusivo)"
            value={accessFilter}
            onChange={e => setAccessFilter(e.target.value as any)}
            className="w-full bg-paper-600 border border-rule rounded-lg px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-rubrica min-h-[44px]"
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
            className="w-full bg-paper-600 border border-rule rounded-lg px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-rubrica min-h-[44px]"
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
      <p className="text-xs text-ink-soft">
        {filteredItems.length === 1
          ? '1 documento encontrado'
          : `${filteredItems.length} documentos encontrados`}
      </p>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="Nenhum documento com esses critérios"
          body="Tente outro termo, ou volte a todos os tipos de acesso para ver o arquivo digital completo."
          action={{
            label: 'Limpar filtros',
            onClick: () => {
              setSearch('');
              setAccessFilter('all');
              setMovementFilter('all');
            }
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isExclusive = item.access === 'exclusive';
          const isUnlocked = !isExclusive || currentUser.role === 'subscriber' || currentUser.role === 'admin';

          return (
            <div
              key={item.id}
              className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg codex-card"
            >
              <div>
                <div className="relative h-60 bg-paper-300 p-3 flex items-center justify-center overflow-hidden border-b border-rule-faint">
                  <img
                    src={item.coverImage}
                    alt={`Capa do documento ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                    className="max-h-full max-w-[80%] object-cover rounded shadow-xl border border-rule"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isExclusive ? (
                      <span className="px-2.5 py-1 rounded bg-ocre-tint/90 text-rubrica border border-ocre/35 text-[10px] font-mono font-medium flex items-center gap-1 shadow">
                        <Shield size={11} aria-hidden="true" /> Exclusivo Assinantes
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-verdete-tint/90 text-verdete border border-verdete/35 text-[10px] font-mono font-medium flex items-center gap-1 shadow">
                        <Download size={11} aria-hidden="true" /> PDF Livre / Baixar
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft font-mono">
                    <span>{item.period}</span>
                    <span>•</span>
                    <span>Ano: {item.year}</span>
                    <span>•</span>
                    <span>{item.pages} págs</span>
                  </div>

                  <h3 className="font-cinzel text-base font-bold leading-snug">
                    <button
                      type="button"
                      onClick={() => openReader(item)}
                      className="line-clamp-2 py-1 text-left text-ink transition group-hover:text-rubrica"
                    >
                      {item.title}
                    </button>
                  </h3>

                  <p className="text-xs text-rubrica font-medium font-serif italic">
                    {item.author}
                  </p>

                  <p className="text-xs text-ink-soft line-clamp-3 leading-relaxed font-serif">
                    {item.description}
                  </p>

                  {item.event && (
                    <div className="text-[10px] text-ink-soft bg-paper-600 p-2 rounded-lg border border-rule">
                      <strong className="text-ink-soft">Contexto:</strong> {item.event}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons with 44px min-height */}
              <div className="p-5 pt-3 border-t border-rule-faint bg-paper-400 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openReader(item)}
                  aria-label={`Abrir ${item.title} no leitor seguro`}
                  className="flex-1 min-h-[44px] py-2.5 px-3 rounded-lg bg-paper-400 hover:bg-paper-300 text-ink hover:text-ink border border-rule-strong text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Eye size={15} className="text-rubrica" aria-hidden="true" />
                  <span>{isExclusive && !isUnlocked ? 'Ver Prévia Protegida' : 'Abrir no Leitor'}</span>
                </button>

                {item.downloadUrl && (!isExclusive || isUnlocked) && (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Baixar PDF original de ${item.title}`}
                    className="min-h-[44px] py-2.5 px-4 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
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
