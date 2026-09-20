import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FEATURE_LINKS = [
  { id: 'fisico', title: 'Obras', subtitle: 'Edições raras' },
  { id: 'digital', title: 'Documentos', subtitle: 'Fontes históricas' },
  { id: 'autores', title: 'Autores', subtitle: 'Vidas e ideias' },
  { id: 'artigos', title: 'Ensaios', subtitle: 'Perspectivas críticas' }
];

export const HeroOpening: React.FC = () => {
  const { setActiveTab } = useStore();

  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="museum-frontispiece" aria-labelledby="museum-frontispiece-title">
      <div className="museum-frontispiece__paper" aria-hidden="true" />

      <div className="museum-frontispiece__main">
        <div className="museum-frontispiece__copy">
          <h1 id="museum-frontispiece-title">
            <span>Adversus</span>
            <span>Omnes</span>
          </h1>

          <div className="museum-frontispiece__rule" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p className="museum-frontispiece__latin">Bibliotheca et Archivum</p>
          <blockquote>“Livros, documentos e ideias em perspectiva.”</blockquote>
          <p className="museum-frontispiece__lede">
            Um refúgio para pesquisadores e bibliófilos. Reunimos edições raras e esgotadas do acervo
            físico, digitalização arquivística com leitor protegido contra cópia e um espaço editorial
            independente para ensaios filosóficos e políticos.
          </p>

          <button type="button" onClick={() => goTo('fisico')} className="museum-frontispiece__action">
            <BookOpen size={19} aria-hidden="true" />
            <span>Explorar o acervo</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <figure className="museum-frontispiece__feature">
          <div className="museum-frontispiece__image">
            <img
              src="/de-sphaera-mundi.jpg"
              alt="Página histórica de De Sphaera Mundi com uma esfera armilar gravada"
              width={475}
              height={520}
            />
          </div>
          <figcaption>
            <div>
              <cite>Sacrobosco. De Sphaera Mundi.</cite>
              <span>Veneza, 1568 · Referência iconográfica</span>
            </div>
            <button type="button" onClick={() => goTo('digital')}>
              Ver documentos <ArrowRight size={14} aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      </div>

      <nav className="museum-frontispiece__index" aria-label="Destaques do acervo">
        <div className="museum-frontispiece__index-head">
          <strong>Em destaque do acervo</strong>
          <button type="button" onClick={() => goTo('fisico')}>
            Ver todo o acervo <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="museum-frontispiece__index-links">
          {FEATURE_LINKS.map(item => (
            <button key={item.id} type="button" onClick={() => goTo(item.id)}>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
};
