import React from 'react';
import {
  BookMarked,
  Scroll,
  ArrowRight,
  Compass,
  FileText,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroOpening } from '../components/HeroOpening';

export const HomePage: React.FC = () => {
  const {
    setActiveTab,
    catalog,
    authors,
    articles,
    addToCart,
    openReader,
    setSelectedArticle,
    transitioningCoverId
  } = useStore();

  const featuredPhysical = catalog.filter(c => c.type === 'physical').slice(0, 3);
  const featuredDigital = catalog.filter(c => c.type === 'digital' || c.type === 'historical_doc').slice(0, 3);
  const featuredAuthors = authors.filter(a => a.featured).slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="pb-16">
      <HeroOpening />

      <div className="frontis-curtain space-y-20">
        {/* Section 1: Rare Physical Books */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rule-faint pb-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-ink tracking-wide">
                Raridades do Acervo Físico
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-serif italic max-w-2xl">
                Primeiras edições comemorativas, encadernações em meio-couro e volumes com anotações marginais de época.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('fisico');
                window.scrollTo(0, 0);
              }}
              className="text-xs text-rubrica hover:text-rubrica-deep font-semibold flex items-center gap-1.5 shrink-0 min-h-[44px] transition-colors group"
            >
              <span>Ver todo o catálogo físico</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPhysical.map(item => (
              <div
                key={item.id}
                className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all flex flex-col justify-between overflow-hidden shadow-lg group codex-card"
              >
                <div>
                  <div className="relative h-64 bg-paper-300 p-4 flex items-center justify-center overflow-hidden border-b border-rule-faint">
                    <img
                      src={item.coverImage}
                      alt={`Capa do exemplar ${item.title}`}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-[80%] object-cover rounded shadow-2xl border border-rule"
                    />
                    {item.condition && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-paper-800/92 text-rubrica border border-ocre/35 text-[10px] font-mono">
                        {item.condition}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] text-ink-soft font-mono">
                      {item.politicalMovement} • {item.year}
                    </div>
                    <h3 className="text-base font-cinzel font-bold text-ink group-hover:text-rubrica transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-rubrica font-serif italic">{item.author}</p>
                    <p className="text-xs text-ink-soft line-clamp-2 font-serif">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-rule-faint bg-paper-400 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-ink-faint block">Preço</span>
                    <div className="text-base font-cinzel font-bold text-ink">
                      R$ {item.price.toFixed(2)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    aria-label={`Adicionar ${item.title} à sacola`}
                    className="px-4 py-2.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-semibold text-xs transition min-h-[44px]"
                  >
                    Adicionar à Sacola
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Protected Online Documents */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rule-faint pb-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-ink tracking-wide">
                Documentos & Fac-símiles Digitais
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-serif italic max-w-2xl">
                Manifestos e cartas históricas digitalizados, abertos ao público ou reservados a assinantes no leitor protegido.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('digital');
                window.scrollTo(0, 0);
              }}
              className="text-xs text-rubrica hover:text-rubrica-deep font-semibold flex items-center gap-1.5 shrink-0 min-h-[44px] transition-colors group"
            >
              <span>Ver todo o acervo digital</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDigital.map(item => (
              <div
                key={item.id}
                className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all flex flex-col justify-between overflow-hidden shadow-lg group p-5 space-y-4 codex-card"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.coverImage}
                    alt={`Capa do documento ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                    className="w-16 h-22 object-cover rounded border border-rule shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.access === 'exclusive' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ocre-tint text-rubrica border border-ocre/35 flex items-center gap-1">
                          <Lock size={10} aria-hidden="true" /> Assinante
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-verdete-tint text-verdete border border-verdete/35">
                          PDF Livre
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel text-sm font-bold leading-snug">
                      <button
                        type="button"
                        onClick={() => openReader(item)}
                        className="line-clamp-2 py-1 text-left text-ink transition group-hover:text-rubrica"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="text-xs text-ink-soft font-serif italic truncate">{item.author}</p>
                  </div>
                </div>

                <p className="text-xs text-ink-soft font-serif line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => openReader(item)}
                  aria-label={`Abrir ${item.title} no leitor seguro`}
                  className="w-full py-2.5 px-3 rounded-lg bg-paper-600 hover:bg-paper-300 text-ink hover:text-ink border border-rule-strong text-xs font-semibold transition flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>Abrir no Leitor Seguro</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Authors Spotlight */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rule-faint pb-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-ink tracking-wide">
                Pensadores e Teóricos em Destaque
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-serif italic max-w-2xl">
                Páginas autorais dedicadas com catálogo biográfico e bibliográfico de cada pensador.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('autores');
                window.scrollTo(0, 0);
              }}
              className="text-xs text-rubrica hover:text-rubrica-deep font-semibold flex items-center gap-1.5 shrink-0 min-h-[44px] transition-colors group"
            >
              <span>Ver todos os autores</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAuthors.map(author => (
              <div
                key={author.id}
                tabIndex={0}
                role="button"
                onClick={() => {
                  setActiveTab('autores');
                  window.scrollTo(0, 0);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab('autores');
                    window.scrollTo(0, 0);
                  }
                }}
                className="p-5 rounded-xl bg-paper-700 border border-rule hover:border-rubrica/60 transition-all text-center space-y-3 cursor-pointer group shadow-lg codex-card"
              >
                <img
                  src={author.avatar}
                  alt={`Foto de ${author.name}`}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-rule-strong group-hover:border-rubrica transition shadow-md"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-sans font-medium text-rubrica uppercase tracking-wider block">
                    {author.politicalMovement}
                  </span>
                  <h3 className="text-base font-cinzel font-bold text-ink group-hover:text-rubrica transition">
                    {author.name}
                  </h3>
                  <p className="text-xs text-ink-soft font-serif italic">{author.period}</p>
                </div>

                <p className="text-xs text-ink-soft font-serif line-clamp-2 leading-relaxed">
                  {author.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Latest Articles from Editorial Blog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rule-faint pb-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-ink tracking-wide">
                Últimos Artigos Publicados
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-serif italic max-w-2xl">
                Análises sobre a recepção da literatura política e notas de pesquisa arquivística.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('artigos');
                window.scrollTo(0, 0);
              }}
              className="text-xs text-rubrica hover:text-rubrica-deep font-semibold flex items-center gap-1.5 shrink-0 min-h-[44px] transition-colors group"
            >
              <span>Ler todos os artigos</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map(art => (
              <div
                key={art.id}
                tabIndex={0}
                role="button"
                onClick={() => {
                  setSelectedArticle(art);
                  setActiveTab('artigos');
                  window.scrollTo(0, 0);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedArticle(art);
                    setActiveTab('artigos');
                    window.scrollTo(0, 0);
                  }
                }}
                className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all overflow-hidden cursor-pointer group shadow-lg flex flex-col justify-between codex-card"
              >
                <div>
                  <img
                    src={art.coverImage}
                    alt={`Imagem ilustrativa de ${art.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-ink-soft">
                      <span className="text-rubrica font-medium">{art.category}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-ink group-hover:text-rubrica transition line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-ink-soft font-serif line-clamp-2">{art.subtitle}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 text-[11px] text-ink-soft font-mono border-t border-rule-faint mt-2 pt-2">
                  Por {art.authorName}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
