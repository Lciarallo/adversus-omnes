import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from './Dialog';

/* Confirmação de ação destrutiva: nomeia o objeto e a consequência,
   e repete o verbo no botão em vez de oferecer "Sim / Não". */

export interface ConfirmRequest {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  request: ConfirmRequest | null;
  onDismiss: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ request, onDismiss }) => (
  <Dialog
    open={!!request}
    onClose={onDismiss}
    labelledBy="confirm-dialog-title"
    describedBy="confirm-dialog-body"
    panelClassName="w-full max-w-md rounded-2xl border border-rule bg-paper-700 p-6 shadow-2xl"
  >
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rubrica/40 bg-rubrica-tint/50 text-rubrica-deep">
        <AlertTriangle size={20} aria-hidden="true" />
      </div>
      <div className="min-w-0 space-y-1.5">
        <h2 id="confirm-dialog-title" className="font-cinzel text-base font-bold text-ink">
          {request?.title}
        </h2>
        <p id="confirm-dialog-body" className="text-xs leading-relaxed text-ink-soft">
          {request?.body}
        </p>
      </div>
    </div>

    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onDismiss}
        className="min-h-[44px] rounded-lg bg-paper-400 px-4 py-2.5 text-xs font-medium text-ink-soft transition hover:bg-paper-300"
      >
        Manter no acervo
      </button>
      <button
        type="button"
        data-autofocus=""
        onClick={() => {
          request?.onConfirm();
          onDismiss();
        }}
        className="min-h-[44px] rounded-lg border border-rubrica/50 bg-rubrica-tint/70 px-5 py-2.5 text-xs font-semibold text-rubrica-deep transition hover:bg-rubrica-tint/70 hover:text-ink"
      >
        {request?.confirmLabel}
      </button>
    </div>
  </Dialog>
);
