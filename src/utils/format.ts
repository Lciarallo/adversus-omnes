/* ------------------------------------------------------------------ *
 * Datas "AAAA-MM-DD" são dias de calendário, não instantes. Passá-las  *
 * direto a `new Date` as lê como meia-noite UTC, e no fuso de Brasília *
 * o dia exibido recua um. Aqui elas são sempre tratadas como locais.  *
 * ------------------------------------------------------------------ */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseDate = (value: string): Date => {
  const match = DATE_ONLY.exec(value);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Date(value);
};

export const formatDate = (value: string): string => {
  const date = parseDate(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
};

/** Dia de calendário local no formato AAAA-MM-DD. */
export const toDateOnly = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const todayDateOnly = (): string => toDateOnly(new Date());

export const addMonths = (date: Date, months: number): Date => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

/** Slug estável para títulos em português: sem acentos nem hífens nas pontas. */
export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Valor em reais no padrão brasileiro: R$ 1.250,00. */
export const formatBRL = (value: number): string => BRL.format(value);
