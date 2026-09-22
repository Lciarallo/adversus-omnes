import React from 'react';
import { ArrowRight, BookMarked, FileText, Lock, Scroll } from 'lucide-react';
import { HeroOpening } from '../components/HeroOpening';
import { useStore } from '../context/StoreContext';

interface SectionHeadingProps {
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, description, action, onAction }) => (
  <header className="archive-section__head">
    <h2>{title}</h2>
    <p>{description}</p>
    <button type="button" onClick={onAction}>
      {action} <ArrowRight size={15} aria-hidden="true" />
    </button>
  </header>
);

export const HomePage: React.FC = () => {
  const {
    setActiveTab,
    catalog,
    authors,
    articles,
    addToCart,
    openReader,
    setSelectedAuthor,
    setSelectedArticle,
    transitioningCoverId
  } = useStore();

  const featuredPhysical = catalog.filter(item => item.type === 'physical').slice(0, 3);
  const featuredDigital = catalog
    .filter(item => item.type === 'digital' || item.type === 'historical_doc')
    .slice(0, 4);
  const featuredAuthors = authors.filter(author => author.featured).slice(0, 5);
  const latestArticles = articles.filter(article => article.status === 'published').slice(0, 3);
  const leadPhysical = featuredPhysical[0];

  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <HeroOpening />

      <div className="home-archive">
        <section className="archive-section archive-section--physical">
          <SectionHeading
            title="Raridades do acervo físico"
            description="Edições, encadernações e exemplares descritos pela história material que carregam."
            action="Consultar catálogo completo"
            onAction={() => goTo('fisico')}
          />

          {leadPhysical && (
            <div className="physical-plate">
              <article className="physical-lead">
                <div className="physical-lead__image">
                  <span aria-hidden="true">AO · EXEMPLAR {String(leadPhysical.year).slice(-2)}</span>
                  <img
                    src={leadPhysical.coverImage}
                    alt={`Capa do exemplar ${leadPhysical.title}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="physical-lead__copy">
                  <p>{leadPhysical.condition ?? 'Acervo físico'} · {leadPhysical.year}</p>
                  <h3>{leadPhysical.title}</h3>
                  <cite>{leadPhysical.author}</cite>
                  <p>{leadPhysical.description}</p>
                  <div>
                    <strong>R$ {leadPhysical.price.toFixed(2)}</strong>
                    {leadPhysical.stock > 0 ? (
                      <button type="button" onClick={() => addToCart(leadPhysical)}>
                        Adicionar à sacola <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    ) : (
                      <button type="button" disabled>
                        Esgotado
                      </button>
                    )}
                  </div>
                </div>
              </article>

              <div className="physical-register" aria-label="Outros destaques do acervo físico">
                {featuredPhysical.slice(1).map((item, index) => (
                  <article key={item.id} className="physical-register__item">
                    <span className="physical-register__number" aria-hidden="true">{String(index + 2).padStart(2, '0')}</span>
                    <img src={item.coverImage} alt="" loading="lazy" decoding="async" />
                    <div>
                      <p>{item.politicalMovement} · {item.year}</p>
                      <h3>{item.title}</h3>
                      <cite>{item.author}</cite>
                    </div>
                    <div className="physical-register__action">
                      <strong>R$ {item.price.toFixed(2)}</strong>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={item.stock <= 0}
                        aria-label={item.stock > 0 ? `Adicionar ${item.title} à sacola` : `${item.title} está esgotado`}
                      >
                        <BookMarked size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="archive-section archive-section--digital">
          <SectionHeading
            title="Documentos e fac-símiles"
            description="Fontes primárias e documentos históricos, livres ou reservados a assinantes."
            action="Abrir acervo online"
            onAction={() => goTo('digital')}
          />

          <div className="document-ledger" role="list">
            {featuredDigital.map((item, index) => (
              <article key={item.id} className="document-ledger__row" role="listitem">
                <span className="document-ledger__number" aria-hidden="true">AO.{String(index + 1).padStart(3, '0')}</span>
                <img
                  src={item.coverImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={transitioningCoverId === item.id ? { viewTransitionName: 'codex-cover' } : undefined}
                />
                <div className="document-ledger__title">
                  <p>{item.period} · {item.politicalMovement}</p>
                  <h3>{item.title}</h3>
                  <cite>{item.author}</cite>
                </div>
                <p className="document-ledger__description">{item.description}</p>
                <span className={`document-ledger__access document-ledger__access--${item.access}`}>
                  {item.access === 'exclusive' ? <Lock size={12} aria-hidden="true" /> : <FileText size={12} aria-hidden="true" />}
                  {item.access === 'exclusive' ? 'Assinantes' : 'Acesso livre'}
                </span>
                <button type="button" onClick={() => openReader(item)} aria-label={`Abrir ${item.title} no leitor`}>
                  <Scroll size={18} aria-hidden="true" />
                  <span>Abrir</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="archive-section archive-section--authors">
          <SectionHeading
            title="Índice de autores"
            description="Vidas, movimentos e bibliografias reunidos pela posição que ocupam no mapa das ideias."
            action="Ver índice completo"
            onAction={() => goTo('autores')}
          />

          <div className="author-index" role="list">
            {featuredAuthors.map((author, index) => (
              <div key={author.id} role="listitem">
              <button
                type="button"
                onClick={() => {
                  setSelectedAuthor(author);
                  goTo('autores');
                }}
                className="author-index__row"
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <strong>{author.name}</strong>
                <span>{author.politicalMovement}</span>
                <span>{author.period}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              </div>
            ))}
          </div>
        </section>

        <section className="archive-section archive-section--articles">
          <SectionHeading
            title="Ensaios e notas de pesquisa"
            description="A camada autoral do arquivo: leituras críticas separadas da descrição documental."
            action="Ler todos os ensaios"
            onAction={() => goTo('artigos')}
          />

          <div className="essay-board">
            {latestArticles.map((article, index) => (
              <article key={article.id} className={index === 0 ? 'essay-board__lead' : 'essay-board__item'}>
                <div>
                  <p>{article.category} · {article.readTime}</p>
                  <h3>{article.title}</h3>
                  <p>{article.subtitle}</p>
                  <footer>
                    <span>Por {article.authorName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArticle(article);
                        goTo('artigos');
                      }}
                    >
                      Ler ensaio <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
