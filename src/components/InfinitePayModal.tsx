import React, { useState } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  CheckCircle2,
  Copy,
  Lock,
  Info,
  FlaskConical
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress } from '../types';
import { Dialog } from './ui/Dialog';
import { useToast } from './ui/Toast';

export const InfinitePayModal: React.FC = () => {
  const {
    isInfinitePayModalOpen,
    setIsInfinitePayModalOpen,
    checkoutType,
    checkoutPlan,
    cartTotal,
    selectedShipping,
    createOrder,
    subscribeUser,
    infinitePayConfig,
    setActiveTab
  } = useStore();
  const { notify } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Endereço de entrega do acervo físico
  const [address, setAddress] = useState<ShippingAddress>({
    cep: '01310-200',
    street: 'Avenida Paulista',
    number: '1578',
    complement: 'Apto 42',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP'
  });

  // Dados de cartão de demonstração — nenhum dado real trafega daqui.
  const [cardData, setCardData] = useState({
    number: '4111 1111 1111 1111',
    holder: 'NOME IMPRESSO NO CARTÃO',
    expiry: '10/29',
    cvv: '123',
    installments: '1'
  });

  const totalToPay = checkoutType === 'subscription' && checkoutPlan ? checkoutPlan.priceMonthly : cartTotal;

  const demoPixPayload = `00020126580014br.gov.bcb.pix0136${infinitePayConfig.walletId}520400005303986540${totalToPay.toFixed(
    2
  )}5802BR5914CONTRA HOMINES6009SAO PAULO62070503***6304DEMO`;

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(demoPixPayload);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 3000);
    } catch {
      notify('Não foi possível copiar o código. Selecione o texto abaixo e copie manualmente.', 'error');
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Confete só é baixado quando há o que comemorar.
      try {
        const { default: confetti } = await import('canvas-confetti');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      } catch {
        // A comemoração é opcional; o pedido não depende dela.
      }

      if (checkoutType === 'subscription' && checkoutPlan) {
        subscribeUser(checkoutPlan.name);
      } else {
        const order = createOrder({
          address,
          paymentMethod,
          shippingMethod: selectedShipping?.service || 'SEDEX',
          shippingPrice: selectedShipping?.price || 0
        });
        setConfirmedOrderId(order.id);
      }
    }, 1500);
  };

  const handleClose = () => {
    setIsInfinitePayModalOpen(false);
    setIsSuccess(false);
    setConfirmedOrderId(null);
  };

  const fieldClass =
    'min-h-[44px] w-full rounded-lg border border-line-mid bg-ink-800 p-2.5 text-white focus:border-gold focus:outline-none';

  return (
    <Dialog
      open={isInfinitePayModalOpen}
      onClose={handleClose}
      labelledBy="infinitepay-modal-title"
      describedBy="infinitepay-modal-nature"
      panelClassName="my-auto flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line-mid bg-ink-700 shadow-2xl"
    >
      {/* Cabeçalho */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line-soft bg-ink-800 px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-line-strong bg-ink-550 text-gold">
            <Lock size={16} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="infinitepay-modal-title" className="font-cinzel text-sm font-bold tracking-wide text-white">
                Checkout
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-amber-800/50 bg-amber-950 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-300">
                <FlaskConical size={10} aria-hidden="true" />
                Demonstração
              </span>
            </div>
            <p id="infinitepay-modal-nature" className="text-[11px] leading-relaxed text-stone-400">
              Fluxo simulado do InfinitePay. Nenhum pagamento é processado e nenhum dado é enviado.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar janela de pagamento"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg p-2 text-stone-400 transition hover:bg-ink-450 hover:text-white"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        {isSuccess ? (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950/80 text-emerald-400 shadow-lg">
              <CheckCircle2 size={36} aria-hidden="true" />
            </div>

            <div>
              <h3 className="font-cinzel text-xl font-bold text-white">
                {checkoutType === 'subscription'
                  ? 'Assinatura ativada na demonstração'
                  : 'Pedido registrado na demonstração'}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-stone-300">
                {checkoutType === 'subscription'
                  ? `O plano "${checkoutPlan?.name}" está ativo neste protótipo: o acervo digital e o leitor protegido já aparecem liberados para o seu perfil.`
                  : 'O pedido foi criado neste protótipo, com código de rastreio simulado e baixa no estoque das peças escolhidas.'}
              </p>
            </div>

            {confirmedOrderId && (
              <div className="inline-block rounded-lg border border-line-mid bg-ink-550 p-3 font-mono text-xs text-amber-300">
                Código do pedido: <strong className="text-white">{confirmedOrderId}</strong>
              </div>
            )}

            <div className="flex flex-col justify-center gap-2 pt-4 sm:flex-row">
              <button
                type="button"
                data-autofocus=""
                onClick={() => {
                  handleClose();
                  setActiveTab(checkoutType === 'subscription' ? 'digital' : 'minha-conta');
                }}
                className="min-h-[44px] rounded-lg bg-gold px-5 py-3 text-xs font-semibold text-black transition hover:bg-gold-light"
              >
                {checkoutType === 'subscription'
                  ? 'Abrir o acervo digital'
                  : 'Acompanhar o pedido na minha conta'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] rounded-lg bg-ink-450 px-4 py-3 text-xs text-stone-300 transition hover:bg-ink-350"
              >
                Voltar ao acervo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-ink-600 p-4">
              <div className="min-w-0">
                <span className="block text-xs text-stone-400">
                  {checkoutType === 'subscription' ? 'Plano selecionado' : 'Itens do acervo'}
                </span>
                <span className="block truncate text-sm font-semibold text-white">
                  {checkoutType === 'subscription' ? checkoutPlan?.name : 'Livros e documentos físicos'}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="block text-xs text-stone-400">Total</span>
                <span className="font-cinzel text-lg font-bold tabular-nums text-gold">
                  R$ {totalToPay.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Endereço de entrega */}
            {checkoutType === 'cart' && (
              <fieldset className="space-y-2">
                <legend className="mb-1 block text-xs font-semibold text-stone-300">
                  Endereço de entrega
                </legend>
                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <label htmlFor="ship-cep" className="sr-only">CEP</label>
                    <input
                      id="ship-cep"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="CEP"
                      value={address.cep}
                      onChange={e => setAddress({ ...address, cep: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ship-street" className="sr-only">Rua ou avenida</label>
                    <input
                      id="ship-street"
                      type="text"
                      autoComplete="address-line1"
                      placeholder="Rua / Avenida"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-number" className="sr-only">Número</label>
                    <input
                      id="ship-number"
                      type="text"
                      inputMode="numeric"
                      placeholder="Número"
                      value={address.number}
                      onChange={e => setAddress({ ...address, number: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-district" className="sr-only">Bairro</label>
                    <input
                      id="ship-district"
                      type="text"
                      autoComplete="address-level3"
                      placeholder="Bairro"
                      value={address.neighborhood}
                      onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-city" className="sr-only">Cidade e UF</label>
                    <input
                      id="ship-city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Cidade - UF"
                      value={`${address.city} - ${address.state}`}
                      onChange={e => {
                        const parts = e.target.value.split('-');
                        setAddress({
                          ...address,
                          city: parts[0]?.trim() || address.city,
                          state: parts[1]?.trim() || address.state
                        });
                      }}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {/* Forma de pagamento */}
            <div>
              <span className="mb-2 block text-xs font-semibold text-stone-300">Forma de pagamento</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  aria-pressed={paymentMethod === 'pix'}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition ${
                    paymentMethod === 'pix'
                      ? 'border-gold bg-ink-500 text-white shadow-md'
                      : 'border-line-mid bg-ink-650 text-stone-400 hover:border-line-bright'
                  }`}
                >
                  <QrCode size={16} className="text-gold" aria-hidden="true" />
                  <span>Pix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  aria-pressed={paymentMethod === 'credit_card'}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition ${
                    paymentMethod === 'credit_card'
                      ? 'border-gold bg-ink-500 text-white shadow-md'
                      : 'border-line-mid bg-ink-650 text-stone-400 hover:border-line-bright'
                  }`}
                >
                  <CreditCard size={16} className="text-gold" aria-hidden="true" />
                  <span>Cartão de crédito</span>
                </button>
              </div>
            </div>

            {/* Detalhe do método */}
            {paymentMethod === 'pix' ? (
              <div className="space-y-3 rounded-xl border border-line bg-ink-800 p-4">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  {/* Selo de demonstração no lugar do QR: não existe cobrança
                      real para codificar, e um quadrado que não escaneia seria
                      um objeto falso na tela. */}
                  <div
                    className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-line-bright bg-ink-700"
                    aria-hidden="true"
                  >
                    <span className="absolute inset-1.5 rounded border border-gold/25" />
                    <span className="absolute inset-[0.4rem] rounded border border-gold/10" />
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <QrCode size={26} className="text-gold/70" />
                      <span className="font-cinzel text-[8px] font-semibold uppercase leading-none tracking-[0.18em] text-gold/80">
                        Demonstração
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
                    <p className="flex items-start gap-1.5 text-xs leading-relaxed text-stone-300">
                      <Info size={13} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                      <span>
                        O QR Code aparece aqui quando a conta InfinitePay do acervo estiver
                        configurada. Nesta demonstração, o código abaixo é fictício.
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line-bright bg-ink-450 px-3.5 py-2 text-xs font-medium text-stone-200 transition hover:bg-ink-350"
                    >
                      {pixCopied ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
                          <span className="font-semibold text-emerald-300">Código copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} className="text-gold" aria-hidden="true" />
                          <span>Copiar o código de exemplo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="truncate rounded-lg border border-line-faint bg-ink-900 p-2.5 font-mono text-[10px] text-stone-400">
                  {demoPixPayload}
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-line bg-ink-800 p-4 text-xs">
                <p className="flex items-start gap-1.5 leading-relaxed text-stone-400">
                  <Info size={13} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>Campos preenchidos com dados de teste. Não informe um cartão real.</span>
                </p>

                <div>
                  <label htmlFor="card-num" className="mb-1 block text-stone-300">
                    Número do cartão
                  </label>
                  <input
                    id="card-num"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={cardData.number}
                    onChange={e => setCardData({ ...cardData, number: e.target.value })}
                    className={`${fieldClass} font-mono`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="card-holder" className="mb-1 block text-stone-300">
                      Nome impresso
                    </label>
                    <input
                      id="card-holder"
                      type="text"
                      autoComplete="off"
                      value={cardData.holder}
                      onChange={e => setCardData({ ...cardData, holder: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="card-exp" className="mb-1 block text-stone-300">
                        Validade
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                        className={`${fieldClass} text-center font-mono`}
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" className="mb-1 block text-stone-300">
                        CVV
                      </label>
                      <input
                        id="card-cvv"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        className={`${fieldClass} text-center font-mono`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="card-installments" className="mb-1 block text-stone-300">
                    Parcelamento
                  </label>
                  <select
                    id="card-installments"
                    value={cardData.installments}
                    onChange={e => setCardData({ ...cardData, installments: e.target.value })}
                    className={fieldClass}
                  >
                    <option value="1">1x de R$ {totalToPay.toFixed(2)} (sem juros)</option>
                    <option value="2">2x de R$ {(totalToPay / 2).toFixed(2)} (sem juros)</option>
                    <option value="3">3x de R$ {(totalToPay / 3).toFixed(2)} (sem juros)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Confirmação */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-deep px-4 py-3.5 text-sm font-semibold text-black shadow-lg shadow-gold/20 transition hover:from-gold-light hover:to-gold-deep disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"
                    aria-hidden="true"
                  />
                  <span>Processando a simulação...</span>
                </>
              ) : (
                <span>
                  {checkoutType === 'subscription' ? 'Simular assinatura' : 'Simular pagamento'} de R${' '}
                  {totalToPay.toFixed(2)}
                </span>
              )}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-stone-400">
              Protótipo de apresentação: o pedido entra no histórico e o estoque baixa, mas nenhuma
              cobrança é feita.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};
