import React, { useEffect, useMemo, useRef } from 'react';
import { BookMarked, Scroll, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/* ------------------------------------------------------------------ *
 * Poeira do arquivo: partículas em canvas que reagem à velocidade da  *
 * rolagem e ao ponteiro. Silenciada sob prefers-reduced-motion e      *
 * pausada assim que o frontispício sai da tela.                       *
 * ------------------------------------------------------------------ */

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  gold: boolean;
}

const ArchiveDust: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let frame = 0;
    let visible = true;
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    const pointer = { x: -9999, y: -9999 };

    const spawn = (seeded: boolean): Mote => ({
      x: Math.random() * width,
      y: seeded ? Math.random() * height : height + Math.random() * 40,
      r: 0.4 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.06 + Math.random() * 0.22),
      alpha: 0.08 + Math.random() * 0.4,
      gold: Math.random() > 0.62
    });

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(160, Math.max(44, (width * height) / 12000)));
      motes = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      scrollBoost *= 0.92;

      for (let i = 0; i < motes.length; i += 1) {
        const mote = motes[i];
        mote.x += mote.vx;
        mote.y += mote.vy + scrollBoost * (mote.r * 0.5);

        // Desvio suave ao redor do cursor: o pó se afasta da mão.
        const dx = mote.x - pointer.x;
        const dy = mote.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 0.01) {
          const push = (90 - dist) / 90 * 0.5;
          mote.x += (dx / dist) * push;
          mote.y += (dy / dist) * push;
        }

        if (mote.y < -20 || mote.x < -30 || mote.x > width + 30) {
          motes[i] = spawn(false);
          continue;
        }

        ctx.globalAlpha = mote.alpha;
        ctx.fillStyle = mote.gold ? '#c89b3c' : '#e8e6e3';
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame || calm.matches) return;
      frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollBoost = Math.max(-5, Math.min(5, scrollBoost + delta * 0.05));
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onCalmChange = () => {
      if (calm.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      } else if (visible) {
        start();
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    calm.addEventListener('change', onCalmChange);

    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      calm.removeEventListener('change', onCalmChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="frontis-dust" aria-hidden="true" />;
};

/* ------------------------------------------------------------------ *
 * Estratos: o vocabulário real do acervo passando em profundidades    *
 * diferentes atrás da página de rosto.                                *
 * ------------------------------------------------------------------ */

interface Stratum {
  key: string;
  words: string[];
  className: string;
  style: React.CSSProperties;
}

const StrataRow: React.FC<{ stratum: Stratum }> = ({ stratum }) => (
  <div className={`frontis-stratum ${stratum.className}`} style={stratum.style}>
    <div className="frontis-stratum-track">
      {[0, 1, 2].map(pass => (
        <React.Fragment key={pass}>
          {stratum.words.map((word, index) => (
            <React.Fragment key={`${pass}-${word}-${index}`}>
              <span>{word}</span>
              <span className="frontis-sep" />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const HeroOpening: React.FC = () => {
  const { setActiveTab, authors, catalog, articles } = useStore();

  // O cabeçalho é sticky e ocupa fluxo: o palco mede a área visível abaixo dele.
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const apply = () => {
      const height = Math.round(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--frontis-nav', `${height}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--frontis-nav');
    };
  }, []);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const publishedArticles = articles.filter(article => article.status === 'published').length;

  const strata = useMemo<Stratum[]>(() => {
    const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

    const names = unique(authors.map(author => author.name));
    const titles = unique(catalog.map(item => item.title.split(':')[0].split('(')[0].trim()));
    const movements = unique(catalog.map(item => item.politicalMovement));
    const periods = unique(catalog.map(item => item.period));

    const fallback = ['Bibliotheca et Archivum', 'Contra Homines'];
    const pick = (values: string[]) => (values.length ? values : fallback);

    return [
      {
        key: 'nomes',
        words: pick(names),
        className: 'frontis-stratum--names',
        style: { '--start': '0%', '--drift': '-7%', top: '10%' } as React.CSSProperties
      },
      {
        key: 'movimentos',
        words: pick([...movements, ...periods]),
        className: 'frontis-stratum--movements',
        style: { '--start': '-6%', '--drift': '-19%', top: '26%' } as React.CSSProperties
      },
      {
        key: 'obras',
        words: pick(titles),
        className: 'frontis-stratum--works',
        style: { '--start': '-3%', '--drift': '-11%', top: '69%' } as React.CSSProperties
      },
      {
        key: 'fundo',
        words: pick([...names].reverse()),
        className: 'frontis-stratum--deep',
        style: { '--start': '-10%', '--drift': '-30%', top: '84%' } as React.CSSProperties
      }
    ];
  }, [authors, catalog]);

  return (
    <section className="frontis" aria-labelledby="frontis-title">
      <div className="frontis-stage">
        <div className="frontis-wash" aria-hidden="true" />

        <div className="frontis-strata" aria-hidden="true">
          {strata.map(stratum => (
            <StrataRow key={stratum.key} stratum={stratum} />
          ))}
        </div>

        <ArchiveDust />

        <div className="frontis-grain" aria-hidden="true" />
        <div className="frontis-vignette" aria-hidden="true" />

        <div className="frontis-frame" aria-hidden="true">
          <span className="frontis-frame-rule frontis-frame-rule--outer" />
          <span className="frontis-frame-rule frontis-frame-rule--inner" />
        </div>

        <div className="frontis-core">
          <div className="frontis-emblem">
            <img src="/logo.jpg" alt="Contra Homines — emblema oficial" width={96} height={96} />
          </div>

          <h1 id="frontis-title" className="frontis-title">
            <span>Contra</span>
            <span className="frontis-title-gold">Homines</span>
          </h1>

          <div className="frontis-rule">
            <span className="frontis-rule-line" />
            <span className="frontis-rule-mark" />
            <span className="frontis-rule-line" />
          </div>

          <p className="frontis-latin">Bibliotheca et Archivum</p>

          <p className="frontis-tagline">“Livros, documentos e ideias em perspectiva.”</p>

          <p className="frontis-lede">
            Um refúgio para pesquisadores e bibliófilos. Reunimos edições raras e esgotadas do acervo
            físico, digitalização arquivística com leitor protegido contra cópia e um espaço editorial
            independente para ensaios filosóficos e políticos.
          </p>

          <div className="frontis-actions">
            <button type="button" onClick={() => goTo('fisico')} className="frontis-cta frontis-cta--gold">
              <BookMarked size={16} aria-hidden="true" />
              <span>Explorar acervo físico</span>
            </button>

            <button type="button" onClick={() => goTo('digital')} className="frontis-cta frontis-cta--ghost">
              <Scroll size={16} aria-hidden="true" />
              <span>Consultar acervo online</span>
            </button>

            <button type="button" onClick={() => goTo('planos')} className="frontis-cta frontis-cta--quiet">
              <Sparkles size={16} aria-hidden="true" />
              <span>Planos do clube</span>
            </button>
          </div>
        </div>

        <div className="frontis-foot">
          <p className="frontis-ledger">
            <span>{authors.length} autores</span>
            <span className="frontis-sep" aria-hidden="true" />
            <span>{catalog.length} obras catalogadas</span>
            <span className="frontis-sep" aria-hidden="true" />
            <span>{publishedArticles} ensaios publicados</span>
          </p>
          <span className="frontis-cue" aria-hidden="true">
            <span className="frontis-cue-dot" />
          </span>
        </div>
      </div>
    </section>
  );
};
