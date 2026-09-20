import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/* Uma falha ao carregar um trecho da aplicação não pode derrubar o
   acervo inteiro no meio de uma apresentação. */

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Falha ao renderizar uma seção do acervo:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber-800/50 bg-amber-950/50 text-gold">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <h2 className="font-cinzel text-xl font-bold tracking-wide text-white">
          Esta seção não pôde ser aberta
        </h2>
        <p className="mt-2 font-serif text-sm italic leading-relaxed text-stone-400">
          O carregamento foi interrompido — em geral por uma queda de conexão no meio do caminho.
          O resto do acervo continua disponível.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-gold-light"
          >
            <RefreshCw size={14} aria-hidden="true" />
            <span>Tentar novamente</span>
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[44px] rounded-lg bg-ink-500 px-5 py-2.5 text-xs font-medium text-stone-300 transition hover:bg-ink-400"
          >
            Recarregar a página
          </button>
        </div>
      </div>
    );
  }
}
