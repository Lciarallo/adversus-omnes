import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  Filter,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EmptyState } from './ui/EmptyState';

export const PhysicalCatalog: React.FC = () => {
  const { catalog, addToCart, cart, currentUser, subscriberRate } = useStore();

  const [search, setSearch] = useState('');
  const [selectedMovement, setSelectedMovement] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'year'>('featured');

  // Filter only physical books
  const physicalItems = catalog.filter(c => c.type === 'physical');

  const movements = Array.from(new Set(physicalItems.map(c => c.politicalMovement).filter(Boolean)));
  const periods = Array.from(new Set(physicalItems.map(c => c.period).filter(Boolean)));
  const conditions = Array.from(new Set(physicalItems.map(c => c.condition).filter(Boolean)));

  const filteredItems = physicalItems
    .filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.author.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchMovement = selectedMovement === 'all' || item.politicalMovement === selectedMovement;
      const matchPeriod = selectedPeriod === 'all' || item.period === selectedPeriod;
      const matchCondition = selectedCondition === 'all' || item.condition === selectedCondition;

      return matchSearch && matchMovement && matchPeriod && matchCondition;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'year') return a.year - b.year;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Editorial Intro */}
      <div className="border-b border-rule-faint pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-ink tracking-wide">
          Acervo Físico: Livros Usados, Raros e Esgotados
        </h1>
        <p className="text-ink-soft font-serif italic text-sm sm:text-base max-w-3xl leading-relaxed">
          Exemplares históricos, primeiras tiragens, volumes encadernados em couro com marcas do tempo e edições esgotadas de profunda relevância política e intelectual.
        </p>

        {currentUser.activePlan && subscriberRate > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-verdete-tint/70 border border-verdete/35 text-xs text-verdete">
            <CheckCircle2 size={14} aria-hidden="true" />
            <span>
              Você possui <strong>{currentUser.activePlan}</strong> ativo: desconto automático de{' '}
              {Math.round(subscriberRate * 100)}% aplicado na sua sacola!
            </span>
          </div>
        )}
      </div>

      {/* Multi-faceted Filter Bar */}
      <div className="bg-paper-700 p-4 sm:p-5 rounded-xl border border-rule space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Buscar livros por título, autor ou assunto"
              placeholder="Buscar por título, autor ou assunto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-paper-600 border border-rule rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-rubrica min-h-[44px]"
            />
          </div>

          {/* Movement */}
          <div>
            <select
              aria-label="Filtrar por movimento político ou filosófico"
              value={selectedMovement}
              onChange={e => setSelectedMovement(e.target.value)}
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

          {/* Period */}
          <div>
            <select
              aria-label="Filtrar por período histórico"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="w-full bg-paper-600 border border-rule rounded-lg px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-rubrica min-h-[44px]"
            >
              <option value="all">Todos os Períodos Históricos</option>
              {periods.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <select
              aria-label="Filtrar por condição de conservação da obra"
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full bg-paper-600 border border-rule rounded-lg px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-rubrica min-h-[44px]"
            >
              <option value="all">Todas as Condições</option>
              {conditions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting options */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rule-faint text-xs text-ink-soft">
          <span>{filteredItems.length} exemplar(es) encontrado(s)</span>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-physical" className="text-ink-soft">
              Ordenar por:
            </label>
            <select
              id="sort-physical"
              aria-label="Ordenar livros físicos por critério"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-paper-600 border border-rule rounded-lg px-3 py-1.5 text-xs text-ink min-h-[40px]"
            >
              <option value="featured">Destaques da Curadoria</option>
              <option value="priceAsc">Menor Preço</option>
              <option value="priceDesc">Maior Preço</option>
              <option value="year">Ano de Publicação (Cronológico)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredItems.length === 0 && (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="Nenhum exemplar com esses critérios"
          body="O acervo físico é feito de peças únicas: quando a combinação de busca, movimento, período e estado não encontra nada, costuma bastar afrouxar um dos filtros."
          action={{
            label: 'Limpar filtros',
            onClick: () => {
              setSearch('');
              setSelectedMovement('all');
              setSelectedPeriod('all');
              setSelectedCondition('all');
            }
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const inCart = cart.find(i => i.item.id === item.id);
          const isSoldOut = item.stock <= 0;

          return (
            <div
              key={item.id}
              className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg codex-card"
            >
              <div>
                {/* Book Cover Image */}
                <div className="relative h-72 bg-paper-400 p-4 flex items-center justify-center overflow-hidden border-b border-rule-faint">
                  <img
                    src={item.coverImage}
                    alt={`Capa original da obra ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-[85%] object-cover rounded shadow-2xl border border-rule-strong"
                  />

                  {/* Condition badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.condition && (
                      <span className="px-2.5 py-1 rounded bg-paper-800/92 backdrop-blur text-rubrica border border-ocre/35 text-[10px] font-mono font-medium shadow">
                        {item.condition}
                      </span>
                    )}
                    {item.stock === 1 && !isSoldOut && (
                      <span className="px-2 py-0.5 rounded bg-rubrica-tint/90 text-rubrica-deep border border-rubrica/50 text-[10px] font-mono">
                        Único em Estoque
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft font-mono">
                    <span>{item.period}</span>
                    <span>•</span>
                    <span>Ano: {item.year}</span>
                    <span>•</span>
                    <span>{item.pages} págs</span>
                  </div>

                  <h2 className="text-base font-cinzel font-bold text-ink group-hover:text-rubrica transition line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-xs text-rubrica font-medium font-serif italic">
                    {item.author}
                  </p>

                  <p className="text-xs text-ink-soft line-clamp-3 leading-relaxed font-serif">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-ink-soft space-y-0.5 pt-1">
                    {item.publisher && (
                      <div>
                        <span className="text-ink-faint">Editora:</span> {item.publisher}
                      </div>
                    )}
                    {item.dimensions && (
                      <div>
                        <span className="text-ink-faint">Formato:</span> {item.dimensions}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-3 border-t border-rule-faint bg-paper-400 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink-faint block">
                    Valor do Exemplar
                  </span>
                  <div className="text-lg font-cinzel font-bold text-ink">
                    R$ {item.price.toFixed(2)}
                  </div>
                </div>

                {isSoldOut ? (
                  <button
                    type="button"
                    disabled
                    aria-label="Exemplar esgotado"
                    className="px-4 py-2.5 rounded-lg bg-paper-300 text-ink-soft text-xs font-semibold cursor-not-allowed min-h-[44px]"
                  >
                    Esgotado
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    aria-label={`Comprar ${item.title}`}
                    className="px-4 py-2.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-rubrica/15 min-h-[44px]"
                  >
                    <ShoppingBag size={15} aria-hidden="true" />
                    <span>{inCart ? `Adicionado (${inCart.quantity})` : 'Comprar'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
