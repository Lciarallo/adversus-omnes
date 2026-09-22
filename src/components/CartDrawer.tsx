import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Tag,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CorreiosQuote } from '../types';
import { Dialog } from './ui/Dialog';
import { formatBRL } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    subscriberDiscount,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    calculateShipping,
    currentUser,
    hasFreeShipping,
    startCartCheckout,
    setActiveTab
  } = useStore();

  const [cepInput, setCepInput] = useState('');
  const [cepError, setCepError] = useState<string | null>(null);
  const [shippingQuotes, setShippingQuotes] = useState<CorreiosQuote[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const close = () => setIsCartOpen(false);
  const unitCount = cart.reduce((total, entry) => total + entry.quantity, 0);
  const canCheckout = hasFreeShipping || !!selectedShipping;

  // Sacola esvaziada (inclusive por um pedido concluído): as cotações e o
  // retorno do cupom da compra anterior não valem mais.
  useEffect(() => {
    if (cart.length > 0) return;
    setShippingQuotes([]);
    setCouponFeedback(null);
    setCouponInput('');
  }, [cart.length]);

  const handleCalculateCep = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cepInput.replace(/\D/g, '');
    if (digits.length !== 8) {
      setCepError('O CEP tem 8 dígitos — por exemplo, 01310-200.');
      return;
    }
    setCepError(null);
    setIsCalculatingShipping(true);
    setTimeout(() => {
      const quotes = calculateShipping(cepInput);
      setShippingQuotes(quotes);
      if (quotes.length > 0) setSelectedShipping(quotes[0]);
      setIsCalculatingShipping(false);
    }, 400);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponFeedback(applyCoupon(couponInput));
  };

  const isFreeShipping = hasFreeShipping;

  return (
    <Dialog
      open={isCartOpen}
      onClose={close}
      labelledBy="cart-drawer-heading"
      placement="right"
      motionClassName="cart-drawer-panel"
      panelClassName="flex h-full w-full max-w-md flex-col border-l border-rule bg-paper-700 shadow-2xl"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-rule-faint bg-paper-400 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 id="cart-drawer-heading" className="font-cinzel text-lg font-bold tracking-wide text-ink">
            Sua Sacola de Obras
          </h2>
          <p className="font-serif text-xs italic text-ink-soft">
            {unitCount === 0
              ? 'Nenhum exemplar selecionado'
              : unitCount === 1
              ? '1 exemplar selecionado do acervo'
              : `${unitCount} exemplares selecionados do acervo`}
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar sacola de compras"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-ink-soft transition hover:bg-paper-300 hover:text-ink"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        {cart.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rule bg-paper-600 text-rubrica">
              <BookMarked size={26} aria-hidden="true" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-ink">Sua sacola está vazia</h3>
            <p className="mx-auto mt-2 max-w-xs font-serif text-xs italic leading-relaxed text-ink-soft">
              O acervo físico reúne primeiras edições, exemplares esgotados e peças únicas — cada
              uma com sua ficha de conservação e procedência.
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                setActiveTab('fisico');
              }}
              className="mt-5 min-h-[44px] rounded-lg border border-rule-strong bg-paper-600 px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-rubrica/60 hover:text-ink"
            >
              Percorrer o acervo físico
            </button>
          </div>
        ) : (
          cart.map(({ item, quantity }) => (
            <div
              key={item.id}
              className="relative flex gap-3.5 rounded-lg border border-rule bg-paper-600 p-3"
            >
              <img
                src={item.coverImage}
                alt={`Capa de ${item.title}`}
                loading="lazy"
                decoding="async"
                className="h-22 w-16 shrink-0 rounded border border-rule-strong object-cover shadow-md"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="min-w-0">
                  {item.condition && (
                    <span className="mb-1 inline-block rounded border border-ocre/35 bg-ocre-tint/80 px-1.5 py-0.5 font-mono text-[10px] text-rubrica">
                      {item.condition}
                    </span>
                  )}
                  <h3 className="truncate text-xs font-semibold text-ink" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="truncate text-[11px] text-ink-soft">{item.author}</p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-rule pt-1">
                  <div className="flex items-center gap-1 rounded border border-rule bg-paper-700">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, quantity - 1)}
                      aria-label={`Diminuir quantidade de ${item.title}`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-soft transition hover:text-ink"
                    >
                      <Minus size={13} aria-hidden="true" />
                    </button>
                    <span className="px-2 text-xs font-semibold tabular-nums text-ink">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, quantity + 1)}
                      aria-label={`Aumentar quantidade de ${item.title}`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-soft transition hover:text-ink"
                    >
                      <Plus size={13} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold tabular-nums text-rubrica">
                      {formatBRL((item.price * quantity))}
                    </div>
                    {item.stock === 1 && (
                      <div className="text-[9px] font-medium text-rubrica">Peça única</div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remover ${item.title} da sacola`}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center self-start text-ink-soft transition hover:text-rubrica"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))
        )}

        {/* Correios Shipping Simulator */}
        {cart.length > 0 && (
          <div className="space-y-3 rounded-lg border border-rule bg-paper-600 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Truck size={16} className="text-rubrica" aria-hidden="true" />
              <span>Frete pelos Correios</span>
            </div>

            <form onSubmit={handleCalculateCep} className="flex gap-2" noValidate>
              <div className="flex-1">
                <label htmlFor="cart-cep" className="sr-only">
                  CEP de entrega
                </label>
                <input
                  id="cart-cep"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="01310-200"
                  maxLength={9}
                  aria-invalid={!!cepError}
                  aria-describedby={cepError ? 'cart-cep-erro' : undefined}
                  value={cepInput}
                  onChange={e => {
                    setCepInput(e.target.value);
                    if (cepError) setCepError(null);
                  }}
                  className={`min-h-[44px] w-full rounded-lg border bg-paper-400 px-3 py-2 text-xs text-ink placeholder-ink-faint focus:outline-none ${
                    cepError ? 'border-rubrica focus:border-rubrica' : 'border-rule-strong focus:border-rubrica'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isCalculatingShipping}
                className="min-h-[44px] shrink-0 rounded-lg border border-rule-strong bg-paper-300 px-4 py-2 text-xs text-ink transition hover:bg-paper-300 disabled:opacity-50"
              >
                {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {cepError && (
              <p id="cart-cep-erro" role="alert" className="flex items-center gap-1.5 text-[11px] text-rubrica-deep">
                <AlertCircle size={12} aria-hidden="true" />
                <span>{cepError}</span>
              </p>
            )}

            {isFreeShipping && (
              <div className="flex items-center gap-1.5 rounded-lg border border-verdete/35 bg-verdete-tint/50 p-2.5 text-[11px] text-verdete">
                <CheckCircle size={13} aria-hidden="true" />
                <span>
                  Benefício Membro do Círculo: <strong>frete SEDEX incluso</strong>
                </span>
              </div>
            )}

            {shippingQuotes.length > 0 && !isFreeShipping && (
              <fieldset className="space-y-1.5 pt-1">
                <legend className="sr-only">Opções de frete dos Correios</legend>
                {shippingQuotes.map(quote => (
                  <label
                    key={quote.service}
                    className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-lg border p-3 text-xs transition ${
                      selectedShipping?.service === quote.service
                        ? 'border-rubrica bg-paper-300 text-ink'
                        : 'border-rule bg-paper-700 text-ink-soft hover:border-rule-strong'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping?.service === quote.service}
                        onChange={() => setSelectedShipping(quote)}
                        className="h-4 w-4 accent-rubrica"
                      />
                      <div>
                        <span className="font-medium text-ink">{quote.service}</span>
                        <span className="ml-1.5 text-[10px] text-ink-soft">
                          ({quote.deadlineDays} {quote.deadlineDays === 1 ? 'dia útil' : 'dias úteis'})
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums text-rubrica">
                      {formatBRL(quote.price)}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            <p className="text-[10px] leading-relaxed text-ink-faint">
              Simulação de demonstração: os valores seguem a tabela por região, sem consulta aos
              Correios.
            </p>
          </div>
        )}

        {/* Coupons Section */}
        {cart.length > 0 && (
          <div className="space-y-2 rounded-lg border border-rule bg-paper-600 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-ink">
                <Tag size={15} className="text-rubrica" aria-hidden="true" /> Cupom de desconto
              </span>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    removeCoupon();
                    setCouponFeedback(null);
                    setCouponInput('');
                  }}
                  className="min-h-[36px] text-[11px] text-rubrica underline transition hover:text-rubrica-deep"
                >
                  Remover cupom
                </button>
              )}
            </div>

            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="cart-coupon" className="sr-only">
                    Código do cupom de desconto
                  </label>
                  <input
                    id="cart-coupon"
                    type="text"
                    placeholder="BEMVINDO10"
                    autoComplete="off"
                    aria-describedby={couponFeedback && !couponFeedback.success ? 'cart-coupon-erro' : undefined}
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="min-h-[44px] w-full rounded-lg border border-rule-strong bg-paper-400 px-3 py-2 font-mono text-xs uppercase text-ink placeholder-ink-faint focus:border-rubrica focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] shrink-0 rounded-lg border border-rule-strong bg-paper-300 px-4 py-2 text-xs text-ink transition hover:bg-paper-300"
                >
                  Aplicar
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-verdete/35 bg-paper-400 p-2.5 text-xs text-verdete">
                <span className="font-mono font-bold">{appliedCoupon.code}</span>
                <span className="tabular-nums">−{appliedCoupon.discountPercentage}%</span>
              </div>
            )}

            {couponFeedback && !appliedCoupon && (
              <p
                id="cart-coupon-erro"
                role="alert"
                className="flex items-start gap-1.5 text-[11px] text-rubrica-deep"
              >
                <AlertCircle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{couponFeedback.message}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer / Summary & Checkout */}
      {cart.length > 0 && (
        <div className="shrink-0 space-y-3 border-t border-rule-faint bg-paper-400 p-4 sm:p-6">
          <div className="space-y-1.5 text-xs tabular-nums">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal das obras</span>
              <span>{formatBRL(cartSubtotal)}</span>
            </div>

            {subscriberDiscount > 0 && (
              <div className="flex justify-between text-verdete">
                <span>Desconto do plano ({currentUser.activePlan})</span>
                <span>−{formatBRL(subscriberDiscount)}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex justify-between text-verdete">
                <span>Cupom {appliedCoupon.code}</span>
                <span>−{formatBRL(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-ink-soft">
              <span>Frete (Correios)</span>
              <span>
                {isFreeShipping
                  ? 'Incluso'
                  : selectedShipping
                  ? `${formatBRL(selectedShipping.price)}`
                  : 'A calcular'}
              </span>
            </div>

            <div className="flex justify-between border-t border-rule-faint pt-2 text-sm font-bold text-ink">
              <span>Total do pedido</span>
              <span className="font-cinzel text-base text-rubrica">{formatBRL(cartTotal)}</span>
            </div>
          </div>

          {!canCheckout && (
            <p id="cart-checkout-hint" className="text-center text-[11px] text-ink-soft">
              Calcule o frete pelo CEP para seguir ao pagamento.
            </p>
          )}
          <button
            type="button"
            disabled={!canCheckout}
            aria-describedby={canCheckout ? undefined : 'cart-checkout-hint'}
            onClick={() => {
              close();
              startCartCheckout();
            }}
            className="group flex min-h-[48px] w-full disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center gap-2 rounded-lg bg-rubrica px-4 py-3 text-sm font-semibold text-paper-800 shadow-lg shadow-rubrica/20 transition hover:bg-rubrica-deep"
          >
            <span>Ir para o checkout</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>

          <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-ink-soft">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-verdete" aria-hidden="true" /> Peças únicas
              reservadas na sacola
            </span>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1">
              <CreditCard size={13} className="text-rubrica" aria-hidden="true" /> Pix e cartão
            </span>
          </div>
        </div>
      )}
    </Dialog>
  );
};
