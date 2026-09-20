import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* ------------------------------------------------------------------ *
 * Diálogo: um só lugar onde mora o ciclo de vida completo de uma      *
 * janela modal — foco inicial, Tab preso ao painel, Escape, trava de  *
 * rolagem, fundo inerte e devolução do foco ao gatilho.               *
 *                                                                     *
 * Renderiza em portal no <body> para escapar dos contextos de clip    *
 * da árvore da aplicação.                                             *
 * ------------------------------------------------------------------ */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

let openCount = 0;

const lockScroll = () => {
  if (openCount++ > 0) return;
  const gutter = window.innerWidth - document.documentElement.clientWidth;
  document.body.dataset.chScroll = document.body.style.overflow;
  document.body.dataset.chPad = document.body.style.paddingRight;
  document.body.style.overflow = 'hidden';
  if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
};

const unlockScroll = () => {
  if (--openCount > 0) return;
  openCount = 0;
  document.body.style.overflow = document.body.dataset.chScroll || '';
  document.body.style.paddingRight = document.body.dataset.chPad || '';
  delete document.body.dataset.chScroll;
  delete document.body.dataset.chPad;
};

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id do elemento que dá nome ao diálogo */
  labelledBy: string;
  /** id de um elemento que descreve o diálogo, quando houver */
  describedBy?: string;
  children: React.ReactNode;
  /** classes do painel; o posicionamento vem de `placement` */
  panelClassName?: string;
  placement?: 'center' | 'right';
  /** classe de animação já definida em index.css */
  motionClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  panelClassName = '',
  placement = 'center',
  motionClassName = 'codex-modal-panel'
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // A função de fechar costuma ser recriada a cada render do consumidor.
  // Guardá-la numa ref mantém o efeito preso apenas à abertura: sem isso,
  // cada render remontava a armadilha de foco e recapturava o gatilho de
  // dentro do próprio diálogo, quebrando a devolução do foco.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    lockScroll();

    // Tudo que não é este diálogo sai da árvore de acessibilidade e do Tab.
    const inerted: HTMLElement[] = [];
    for (const child of Array.from(document.body.children) as HTMLElement[]) {
      if (
        child.contains(panel) ||
        child.hasAttribute('inert') ||
        child.hasAttribute('data-ch-overlay')
      ) continue;
      child.setAttribute('inert', '');
      inerted.push(child);
    }

    const frame = requestAnimationFrame(() => {
      if (!panel) return;
      const first =
        panel.querySelector<HTMLElement>('[data-autofocus]') ||
        panel.querySelector<HTMLElement>(FOCUSABLE);
      (first || panel).focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const stops = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
      );
      if (stops.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown, true);
      inerted.forEach(el => el.removeAttribute('inert'));
      unlockScroll();
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const shell =
    placement === 'right'
      ? 'fixed inset-0 z-50 flex justify-end'
      : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain';

  return createPortal(
    <div className={shell}>
      <div
        onClick={() => onCloseRef.current()}
        className="fixed inset-0 bg-ink/45 backdrop-blur-[2px]"
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`relative z-10 outline-none ${motionClassName} ${panelClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
