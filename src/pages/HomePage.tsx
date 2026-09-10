import React from 'react';
import {
  BookOpen,
  Sparkles,
  BookMarked,
  Scroll,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HomePage: React.FC = () => {
  const {
    setActiveTab,
    catalog,
    authors,
    articles,
    addToCart,
    openReader,
    setSelectedArticle
  } = useStore();

  const featuredPhysical = catalog.filter(c => c.type === 'physical').slice(0, 3);
  const featuredDigital = catalog.filter(c => c.type === 'digital' || c.type === 'historical_doc').slice(0, 3);
  const featuredAuthors = authors.filter(a => a.featured).slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#13151b] via-[#101115] to-[#0d0e12] border-b border-[#242735] pt-16 pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#c89b3c]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b1e27] border border-[#313647] text-xs text-[#c89b3c] font-cinzel font-medium tracking-wider shadow-sm">
            <Sparkles size={13} />
            <span>Preservação da Memória & Pensamento Crítico</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold text-white tracking-tight leading-tight">
            BIBLIOTECA <span className="text-[#c89b3c]">CONTRASTE</span>
          </h1>

          <p className="text-lg sm:text-2xl text-stone-300 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Livros, documentos e ideias em perspectiva."
          </p>

          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Um refúgio para pesquisadores e bibliófilos. Reunimos edições raras e esgotadas do acervo físico, digitalização arquivística com leitor protegido contra cópia e um espaço editorial independente para ensaios filosóficos e políticos.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={() => {
                setActiveTab('fisico');
                window.scrollTo(0, 0);
              }}
              className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#a87e28] hover:from-[#d9ab4b] hover:to-[#b88c32] text-black font-semibold text-xs uppercase tracking-wider transition shadow-xl shadow-[#c89b3c]/20 flex items-center justify-center gap-2"
            >
              <BookMarked size={16} />
              <span>Explorar Acervo Físico (Raros)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('digital');
                window.scrollTo(0, 0);
              }}
              className="px-6 py-3.5 rounded-lg bg-[#1a1d26] hover:bg-[#252936] text-stone-200 hover:text-white border border-[#34384a] font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <Scroll size={16} className="text-[#c89b3c]" />
              <span>Consultar Acervo Online</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('planos');
                window.scrollTo(0, 0);
              }}
              className="px-6 py-3.5 rounded-lg bg-[#14161d] hover:bg-[#1f222d] text-[#c89b3c] border border-amber-900/50 font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Planos do Clube</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Rare Physical Books (Acervo Físico em Destaque) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252834] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
              <BookMarked size={14} /> Colecionismo & Bibliófilia
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Raridades do Acervo Físico
            </h2>
            <p className="text-xs text-stone-400 font-serif italic mt-0.5">
              Primeiras edições comemorativas, encadernações em meio-couro e volumes com anotações marginais de época.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('fisico');
              window.scrollTo(0, 0);
            }}
            className="text-xs text-[#c89b3c] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ver todo o catálogo físico</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPhysical.map(item => (
            <div
              key={item.id}
              className="bg-[#15171e] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
            >
              <div>
                <div className="relative h-64 bg-[#0b0c0e] p-4 flex items-center justify-center overflow-hidden border-b border-[#20232e]">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="max-h-full max-w-[80%] object-cover rounded shadow-2xl transition duration-500 group-hover:scale-105 border border-[#323644]"
                  />
                  {item.condition && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/85 text-[#c89b3c] border border-amber-800/50 text-[10px] font-mono">
                      {item.condition}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[11px] text-stone-400 font-mono">
                    {item.politicalMovement} • {item.year}
                  </div>
                  <h3 className="text-base font-cinzel font-bold text-white group-hover:text-[#c89b3c] transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#c89b3c] font-serif italic">{item.author}</p>
                  <p className="text-xs text-stone-400 line-clamp-2 font-serif">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#20232e] bg-[#12141a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-500 block">Preço</span>
                  <div className="text-base font-cinzel font-bold text-white">
                    R$ {item.price.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="px-3.5 py-1.5 rounded bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition"
                >
                  Adicionar à Sacola
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Protected Online Documents (Acervo Digital e Leitor Seguro) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252834] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
              <Scroll size={14} /> Arquivo Histórico & Leitor Protegido
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Documentos & Fac-símiles Digitais
            </h2>
            <p className="text-xs text-stone-400 font-serif italic mt-0.5">
              Consulte manifestos e cartas históricas digitalizadas com proteção per-session contra extração de dados.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('digital');
              window.scrollTo(0, 0);
            }}
            className="text-xs text-[#c89b3c] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ver todo o acervo digital</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDigital.map(item => (
            <div
              key={item.id}
              className="bg-[#15171e] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between overflow-hidden shadow-lg group p-5 space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.coverImage}
                  alt=""
                  className="w-16 h-22 object-cover rounded border border-[#323644] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.access === 'exclusive' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-[#c89b3c] border border-amber-800/40 flex items-center gap-1">
                        <Lock size={10} /> Assinante
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        PDF Livre
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => openReader(item)}
                    className="text-sm font-cinzel font-bold text-white group-hover:text-[#c89b3c] cursor-pointer transition line-clamp-2"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-serif italic truncate">{item.author}</p>
                </div>
              </div>

              <p className="text-xs text-stone-300 font-serif line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <button
                onClick={() => openReader(item)}
                className="w-full py-2 px-3 rounded bg-[#1e212b] hover:bg-[#292d3b] text-stone-200 hover:text-white border border-[#33384a] text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Abrir no Leitor Seguro</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Authors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252834] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
              <Compass size={14} /> Correntes de Pensamento
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Pensadores e Teóricos em Destaque
            </h2>
            <p className="text-xs text-stone-400 font-serif italic mt-0.5">
              Páginas autorais dedicadas com catálogo biográfico e bibliográfico de cada pensador.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('autores');
              window.scrollTo(0, 0);
            }}
            className="text-xs text-[#c89b3c] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ver todos os autores</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAuthors.map(author => (
            <div
              key={author.id}
              onClick={() => {
                setActiveTab('autores');
                window.scrollTo(0, 0);
              }}
              className="p-5 rounded-xl bg-[#15171e] border border-[#272b38] hover:border-[#c89b3c]/60 transition-all text-center space-y-3 cursor-pointer group shadow-lg"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-[#373c4d] group-hover:border-[#c89b3c] transition shadow-md"
              />
              <div>
                <span className="text-[10px] font-mono text-[#c89b3c] uppercase tracking-wider">
                  {author.politicalMovement}
                </span>
                <h3 className="text-base font-cinzel font-bold text-white group-hover:text-[#c89b3c] transition mt-0.5">
                  {author.name}
                </h3>
                <p className="text-[11px] text-stone-400 font-mono">{author.period}</p>
              </div>

              <p className="text-xs text-stone-400 font-serif line-clamp-2 leading-relaxed">
                {author.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Latest Articles from Editorial Blog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252834] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
              <FileText size={14} /> Editorial & Ensaios
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Últimos Artigos Publicados
            </h2>
            <p className="text-xs text-stone-400 font-serif italic mt-0.5">
              Análises sobre a recepção da literatura política e notas de pesquisa arquivística.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('artigos');
              window.scrollTo(0, 0);
            }}
            className="text-xs text-[#c89b3c] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ler todos os artigos</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map(art => (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArticle(art);
                setActiveTab('artigos');
                window.scrollTo(0, 0);
              }}
              className="bg-[#15171e] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all overflow-hidden cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                    <span className="text-[#c89b3c]">{art.category}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-[#c89b3c] transition line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-serif line-clamp-2">{art.subtitle}</p>
                </div>
              </div>

              <div className="p-5 pt-0 text-[11px] text-stone-500 font-mono border-t border-[#20232e] mt-2 pt-2">
                Por {art.authorName}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
