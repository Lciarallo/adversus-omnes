import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

/* ------------------------------------------------------------------ *
 * Avisos: o retorno do sistema acontece dentro da interface, não em   *
 * caixas do navegador. Fica numa região viva, anunciada por leitores  *
 * de tela, e sobrevive aos diálogos modais.                           *
 * ------------------------------------------------------------------ */

export type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TONE: Record<ToastTone, { icon: typeof Info; ring: string; text: string }> = {
  success: { icon: CheckCircle2, ring: 'border-emerald-800/60', text: 'text-emerald-300' },
  error: { icon: AlertCircle, ring: 'border-red-800/60', text: 'text-red-300' },
  info: { icon: Info, ring: 'border-line-bright', text: 'text-gold' }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = ++seq.current;
      setToasts(prev => [...prev.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 4500);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          data-ch-overlay=""
          className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pointer-events-none sm:items-end sm:p-6"
        >
          <div role="status" aria-live="polite" className="contents">
            {toasts.map(toast => {
              const tone = TONE[toast.tone];
              const Icon = tone.icon;
              return (
                <div
                  key={toast.id}
                  className={`pointer-events-auto w-full max-w-sm flex items-start gap-3 rounded-xl border bg-ink-650 px-4 py-3 text-xs leading-relaxed text-stone-200 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)] ch-toast ${tone.ring}`}
                >
                  <Icon size={16} className={`shrink-0 mt-0.5 ${tone.text}`} aria-hidden="true" />
                  <span className="flex-1 min-w-0">{toast.message}</span>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    aria-label="Dispensar aviso"
                    className="shrink-0 -mr-1.5 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-ink-450 hover:text-white"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de ToastProvider');
  return ctx;
};
