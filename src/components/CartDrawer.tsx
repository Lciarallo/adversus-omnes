import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CorreiosQuote } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    calculateShipping,
    currentUser,
    startCartCheckout
  } = useStore();

  const [cepInput, setCepInput] = useState('');
  const [shippingQuotes, setShippingQuotes] = useState<CorreiosQuote[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleCalculateCep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cepInput || cepInput.replace(/\D/g, '').length < 8) {
      alert('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }
    setIsCalculatingShipping(true);
    setTimeout(() => {
      const quotes = calculateShipping(cepInput);
      setShippingQuotes(quotes);
      if (quotes.length > 0) {
        setSelectedShipping(quotes[0]);
      }
      setIsCalculatingShipping(false);
    }, 400);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
  };

  const isFreeShipping = currentUser.activePlan === 'Membro do Círculo';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#16181f] border-l border-[#2e3240] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#262935] flex items-center justify-between bg-[#12141a]">
            <div>
              <h2 className="text-lg font-cinzel font-bold text-white tracking-wide">
                Sua Sacola de Obras
              </h2>
              <p className="text-xs text-stone-400 font-serif italic">
                {cart.length} item(s) selecionado(s) do acervo
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252834] transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#20232d] flex items-center justify-center mx-auto mb-4 text-stone-500">
                  <Tag size={28} />
                </div>
                <h3 className="text-stone-300 font-medium text-base">Sua sacola está vazia</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Nenhum livro físico ou exemplar raro adicionado até o momento.
                </p>
              </div>
            ) : (
              cart.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-lg bg-[#1c1f28] border border-[#2b2f3d] relative group"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-22 object-cover rounded shadow-md border border-[#383c4c] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {item.condition && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-950/80 text-[#c89b3c] border border-amber-800/40 text-[10px] font-mono mb-1">
                          {item.condition}
                        </span>
                      )}
                      <h4 className="text-xs font-semibold text-white truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate">{item.author}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#292d3b]">
                      <div className="flex items-center gap-1.5 bg-[#14161d] border border-[#323644] rounded px-1.5 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, quantity - 1)}
                          className="text-stone-400 hover:text-white p-0.5"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-semibold text-white px-1">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, quantity + 1)}
                          className="text-stone-400 hover:text-white p-0.5"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-[#c89b3c]">
                          R$ {(item.price * quantity).toFixed(2)}
                        </div>
                        {item.stock === 1 && (
                          <div className="text-[9px] text-red-400 font-medium">Peça Única</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-500 hover:text-red-400 p-1 self-start transition"
                    title="Remover da sacola"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}

            {/* Correios Shipping Simulator */}
            {cart.length > 0 && (
              <div className="p-4 rounded-lg bg-[#1a1d26] border border-[#2c303f] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                  <Truck size={16} className="text-[#c89b3c]" />
                  <span>Cálculo de Frete Correios</span>
                </div>

                <form onSubmit={handleCalculateCep} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="01310-200"
                    maxLength={9}
                    value={cepInput}
                    onChange={e => setCepInput(e.target.value)}
                    className="flex-1 bg-[#12141a] border border-[#363a4a] rounded px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c89b3c]"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingShipping}
                    className="bg-[#2a2e3b] hover:bg-[#343949] text-stone-200 text-xs px-3 py-1.5 rounded transition border border-[#3f4456] disabled:opacity-50"
                  >
                    {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
                  </button>
                </form>

                {isFreeShipping && (
                  <div className="p-2 rounded bg-emerald-950/50 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle size={13} />
                    <span>Benefício Membro do Círculo: <strong>Frete Grátis SEDEX</strong></span>
                  </div>
                )}

                {shippingQuotes.length > 0 && !isFreeShipping && (
                  <div className="space-y-1.5 pt-1">
                    {shippingQuotes.map(quote => (
                      <label
                        key={quote.service}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer border text-xs transition ${
                          selectedShipping?.service === quote.service
                            ? 'bg-[#252936] border-[#c89b3c] text-white'
                            : 'bg-[#14161d] border-[#292c3a] text-stone-400 hover:border-[#3d4254]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.service === quote.service}
                            onChange={() => setSelectedShipping(quote)}
                            className="text-[#c89b3c] focus:ring-0"
                          />
                          <div>
                            <span className="font-medium text-white">{quote.service}</span>
                            <span className="text-[10px] text-stone-400 ml-1.5">
                              ({quote.deadlineDays} {quote.deadlineDays === 1 ? 'dia útil' : 'dias úteis'})
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#c89b3c]">
                          R$ {quote.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Coupons Section */}
            {cart.length > 0 && (
              <div className="p-4 rounded-lg bg-[#1a1d26] border border-[#2c303f] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                    <Tag size={15} className="text-[#c89b3c]" /> Cupom de Desconto
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 text-[11px]"
                    >
                      Remover cupom
                    </button>
                  )}
                </div>

                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: BEMVINDO10"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#12141a] border border-[#363a4a] rounded px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c89b3c] uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-[#2a2e3b] hover:bg-[#343949] text-stone-200 text-xs px-3 py-1.5 rounded transition border border-[#3f4456]"
                    >
                      Aplicar
                    </button>
                  </form>
                ) : (
                  <div className="p-2 rounded bg-[#202430] border border-emerald-800/40 text-xs flex items-center justify-between text-emerald-300">
                    <span className="font-mono font-bold">{appliedCoupon.code}</span>
                    <span>-{appliedCoupon.discountPercentage}% OFF</span>
                  </div>
                )}

                {couponFeedback && !appliedCoupon && (
                  <div
                    className={`text-[11px] flex items-center gap-1 ${
                      couponFeedback.success ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {couponFeedback.success ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    <span>{couponFeedback.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#262935] bg-[#12141a] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal das obras</span>
                  <span>R$ {cartSubtotal.toFixed(2)}</span>
                </div>

                {currentUser.activePlan && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto do Plano ({currentUser.activePlan})</span>
                    <span>
                      -R${' '}
                      {(
                        cartSubtotal *
                        (currentUser.activePlan === 'Membro do Círculo'
                          ? 0.2
                          : currentUser.activePlan === 'Pesquisador'
                          ? 0.15
                          : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Cupom ({appliedCoupon.code})</span>
                    <span>
                      -R${' '}
                      {(
                        (cartSubtotal * (1 - (currentUser.activePlan === 'Membro do Círculo' ? 0.2 : currentUser.activePlan === 'Pesquisador' ? 0.15 : 0)) * appliedCoupon.discountPercentage) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>Frete (Correios)</span>
                  <span>
                    {isFreeShipping
                      ? 'Grátis'
                      : selectedShipping
                      ? `R$ ${selectedShipping.price.toFixed(2)}`
                      : 'A calcular'}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#262935]">
                  <span>Total do Pedido</span>
                  <span className="text-[#c89b3c] font-cinzel text-base">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  startCartCheckout();
                }}
                className="w-full py-3 px-4 rounded bg-gradient-to-r from-[#c89b3c] to-[#a87e28] hover:from-[#d9ab4b] hover:to-[#b88c32] text-black font-semibold text-sm transition shadow-lg shadow-[#c89b3c]/20 flex items-center justify-center gap-2 group"
              >
                <span>Finalizar Compra via InfinitePay</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" /> Checkout Seguro
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CreditCard size={13} className="text-[#c89b3c]" /> Pix Instantâneo & Cartão
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
