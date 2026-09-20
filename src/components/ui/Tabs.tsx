import React, { useRef } from 'react';

/* ------------------------------------------------------------------ *
 * Abas com o padrão ARIA inteiro: aba ligada ao painel, tabIndex      *
 * móvel e navegação por setas, Home e End.                            *
 * ------------------------------------------------------------------ */

export interface TabItem<T extends string> {
  id: T;
  label: string;
  /** rótulo curto para telas estreitas; cai no `label` quando ausente */
  labelShort?: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps<T extends string> {
  group: string;
  label: string;
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  group,
  label,
  items,
  value,
  onChange,
  className = ''
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const focusTab = (index: number) => {
    const next = items[(index + items.length) % items.length];
    onChange(next.id);
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLButtonElement>(`#${group}-tab-${next.id}`)
        ?.focus();
    });
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusTab(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(items.length - 1);
        break;
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={`flex flex-wrap gap-2 border-b border-rule-faint pb-1 text-xs ${className}`}
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${group}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${group}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={e => onKeyDown(e, index)}
            className={`flex min-h-[44px] items-center gap-1.5 rounded-lg px-4 py-2.5 font-semibold transition ${
              selected
                ? 'border border-rule-strong bg-paper-400 text-rubrica'
                : 'border border-transparent text-ink-soft hover:bg-paper-600 hover:text-ink'
            }`}
          >
            {item.icon}
            <span className={item.labelShort ? 'hidden sm:inline' : undefined}>{item.label}</span>
            {item.labelShort && <span className="sm:hidden">{item.labelShort}</span>}
            {typeof item.count === 'number' && (
              <span
                className={`ml-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                  selected ? 'bg-paper-300 text-rubrica-deep' : 'bg-paper-600 text-ink-soft'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  group: string;
  id: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ group, id, active, children, className = '' }) => {
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={`${group}-panel-${id}`}
      aria-labelledby={`${group}-tab-${id}`}
      tabIndex={0}
      className={`outline-none ${className}`}
    >
      {children}
    </div>
  );
};
