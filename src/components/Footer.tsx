import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/* O boletim ainda não tem para onde enviar: a interface diz isso em vez
   de encenar um cadastro que não acontece. */
const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'info'; message: string } | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setFeedback({ tone: 'error', message: 'Informe um e-mail completo, como nome@dominio.com.br.' });
      return;
    }
    setFeedback({
      tone: 'info',
      message: 'O boletim entra no ar com o lançamento do acervo; ainda não estamos guardando e-mails.'
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="boletim-email" className="sr-only">
          Seu e-mail para o Boletim Bibliófilo
        </label>
        <input
          id="boletim-email"
          type="email"
          autoComplete="email"
          placeholder="Seu e-mail"
          aria-invalid={feedback?.tone === 'error'}
          aria-describedby={feedback ? 'boletim-retorno' : undefined}
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (feedback) setFeedback(null);
          }}
          className={`min-h-[44px] w-full rounded border bg-ink-650 px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none ${
            feedback?.tone === 'error'
              ? 'border-red-700 focus:border-red-500'
              : 'border-line-mid focus:border-gold'
          }`}
        />
        <button
          type="submit"
          aria-label="Assinar o Boletim Bibliófilo"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded bg-gold px-3 text-xs font-semibold text-black transition hover:bg-gold-light"
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {feedback && (
        <p
          id="boletim-retorno"
          role="status"
          className={`mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed ${
            feedback.tone === 'error' ? 'text-red-300' : 'text-stone-300'
          }`}
        >
          {feedback.tone === 'error' ? (
            <AlertCircle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <Info size={12} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          )}
          <span>{feedback.message}</span>
        </p>
      )}
    </form>
  );
};

export const Footer: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <footer className="bg-ink-900 border-t border-line-soft text-stone-400 text-sm">
      {/* Editorial Trust Banner */}
      <div className="border-b border-line-faint py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-700 border border-line-faint">
            <ShieldCheck className="text-gold w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Ficha honesta de proveniência</h4>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Edição, tiragem e estado de conservação descritos como são — inclusive as marcas do
                tempo. O valor do acervo depende de acreditarem na ficha.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-700 border border-line-faint">
            <Truck className="text-gold w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Envio com rastreio pelos Correios</h4>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Papel neutro e embalagem reforçada para o transporte de obras antigas. SEDEX, PAC e
                Mini Envios para todo o país.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-700 border border-line-faint">
            <CreditCard className="text-gold w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Pix e cartão pelo InfinitePay</h4>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Checkout preparado para Pix e cartão de crédito. Nesta versão de demonstração o
                pagamento é simulado — nada é cobrado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-gold to-gold-dark p-[1px] shadow-sm overflow-hidden shrink-0">
              <img
                src="/logo.jpg"
                alt="Contra Homines"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-cinzel font-bold text-white tracking-wider text-base">
              CONTRA HOMINES
            </span>
          </div>
          <p className="text-xs leading-relaxed text-stone-400 font-serif italic">
            "Bibliotheca et Archivum — Livros, documentos e ideias em perspectiva."
          </p>
          <p className="text-xs leading-relaxed text-stone-400">
            Uma ponte viva entre o acervo físico de obras raras, a documentação histórica esquecida e a produção de ensaios contemporâneos sobre economia, política e filosofia.
          </p>
        </div>

        {/* Acervo & Catálogo */}
        <div>
          <h5 className="text-gold font-cinzel font-semibold text-xs uppercase tracking-widest mb-4">
            Explorar Acervo
          </h5>
          <ul className="space-y-0.5 text-xs">
            <li>
              <button type="button" onClick={() => { setActiveTab('fisico'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Livros Raros & Primeiras Edições
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('fisico'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Livros Usados & Esgotados
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('digital'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Documentos Históricos Livres (PDF)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('digital'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Acervo Restrito de Assinantes
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('autores'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Índice de Autores & Filósofos
              </button>
            </li>
          </ul>
        </div>

        {/* Editorial & Assinaturas */}
        <div>
          <h5 className="text-gold font-cinzel font-semibold text-xs uppercase tracking-widest mb-4">
            Editorial & Planos
          </h5>
          <ul className="space-y-0.5 text-xs">
            <li>
              <button type="button" onClick={() => { setActiveTab('artigos'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Artigos Autorais & Ensaios
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('planos'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Planos do Clube de Assinatura
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('minha-conta'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Portal do Assinante
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setActiveTab('admin'); window.scrollTo(0, 0); }} className="w-full text-left py-2 flex items-center min-h-[44px] hover:text-gold transition">
                Painel do Administrador
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter & Boletim */}
        <div>
          <h5 className="text-gold font-cinzel font-semibold text-xs uppercase tracking-widest mb-4">
            Boletim Bibliófilo
          </h5>
          <p className="text-xs text-stone-400 mb-3">
            Receba notificações de novas aquisições de livros raros, cartas históricas e artigos inéditos.
          </p>
          <NewsletterForm />
          <div className="mt-4 text-xs text-stone-400">
            Cupons ativos de demonstração: <span className="font-mono text-gold">BEMVINDO10</span> | <span className="font-mono text-gold">HISTORIA15</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-line-faint py-4 bg-ink-950 text-center text-xs text-stone-400">
        <p>© 2026 Contra Homines (Bibliotheca et Archivum). Todos os direitos reservados. Preservação cultural, livros físicos e acervo digital.</p>
      </div>
    </footer>
  );
};
