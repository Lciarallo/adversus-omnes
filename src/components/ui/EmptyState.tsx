import React from 'react';

/* Estado vazio: distingue primeira visita de busca sem resultado e
   sempre oferece o próximo passo útil. */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, body, action, className = '' }) => (
  <div
    className={`rounded-2xl border border-dashed border-line bg-ink-750 px-6 py-14 text-center ${className}`}
  >
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line-mid bg-ink-600 text-gold">
      {icon}
    </div>
    <h3 className="font-cinzel text-base font-bold tracking-wide text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md font-serif text-sm italic leading-relaxed text-stone-400">
      {body}
    </p>
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="mt-6 min-h-[44px] rounded-lg border border-line-bright bg-ink-550 px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-gold/60 hover:text-white"
      >
        {action.label}
      </button>
    )}
  </div>
);
