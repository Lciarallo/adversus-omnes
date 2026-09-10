import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { ShippingAddress } from '../types';

export const InfinitePayModal: React.FC = () => {
  const {
    isInfinitePayModalOpen,
    setIsInfinitePayModalOpen,
    checkoutType,
    checkoutPlan,
    cartTotal,
    cartSubtotal,
    discountAmount,
    selectedShipping,
    createOrder,
    subscribeUser,
    infinitePayConfig,
    currentUser,
    setActiveTab
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Address for physical delivery
  const [address, setAddress] = useState<ShippingAddress>({
    cep: '01310-200',
    street: 'Avenida Paulista',
    number: '1578',
    complement: 'Apto 42',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP'
  });

  // Credit card mock form
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4892',
    holder: 'LUIZ E CIARALLO',
    expiry: '10/29',
    cvv: '882',
    installments: '1'
  });

  if (!isInfinitePayModalOpen) return null;

  const totalToPay = checkoutType === 'subscription' && checkoutPlan ? checkoutPlan.priceMonthly : cartTotal;

  const mockPixPayload = `00020126580014br.gov.bcb.pix0136${infinitePayConfig.walletId}520400005303986540${totalToPay.toFixed(2)}5802BR5920BIBLIOTECA CONTRASTE6009SAO PAULO62070503***6304E8A2`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixPayload);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="infinitepay-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-[#15171e] border border-[#2d313f] rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Modal Header */}
        <div className="bg-[#101217] px-6 py-4 border-b border-[#252834] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1f222b] border border-[#353949] flex items-center justify-center text-[#c89b3c]">
              <Lock size={16} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="infinitepay-modal-title" className="text-sm font-cinzel font-bold text-white tracking-wide">
                  Checkout InfinitePay
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {infinitePayConfig.mode === 'sandbox' ? 'Modo Seguro / Sandbox' : 'Produção'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Gateway oficial de pagamentos com liquidação imediata
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar janela de pagamento"
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-[#252834] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} aria-hidden="true" />
              </div>

              <div>
                <h3 className="text-xl font-cinzel font-bold text-white">
                  Pagamento Confirmado com Sucesso!
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-md mx-auto leading-relaxed">
                  {checkoutType === 'subscription'
                    ? `Parabéns! Sua assinatura do plano "${checkoutPlan?.name}" foi ativada. Você já tem acesso irrestrito ao Acervo Digital e Leitor Protegido.`
                    : `Seu pedido foi registrado e encaminhado para nossa equipe de embalagem e catalogação.`}
                </p>
              </div>

              {confirmedOrderId && (
                <div className="p-3 bg-[#1c1f2a] border border-[#2e3244] rounded-lg inline-block text-xs font-mono text-amber-300">
                  Código do Pedido: <strong className="text-white">{confirmedOrderId}</strong>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                {checkoutType === 'subscription' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setActiveTab('digital');
                    }}
                    className="px-5 py-3 rounded-lg bg-[#c89b3c] text-black font-semibold text-xs hover:bg-[#dbaa42] transition min-h-[44px]"
                  >
                    Acessar Acervo Digital Agora
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setActiveTab('minha-conta');
                    }}
                    className="px-5 py-3 rounded-lg bg-[#c89b3c] text-black font-semibold text-xs hover:bg-[#dbaa42] transition min-h-[44px]"
                  >
                    Acompanhar Pedido na Minha Conta
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-3 rounded-lg bg-[#252834] text-stone-300 text-xs hover:bg-[#2f3342] transition min-h-[44px]"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="p-4 rounded-xl bg-[#191c24] border border-[#2b2f3d] flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">
                    {checkoutType === 'subscription' ? 'Plano Selecionado' : 'Itens do Acervo'}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {checkoutType === 'subscription' ? checkoutPlan?.name : 'Livros e Documentos Físicos'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Total a Pagar</span>
                  <span className="text-lg font-cinzel font-bold text-[#c89b3c]">
                    R$ {totalToPay.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Physical Delivery Form if physical checkout */}
              {checkoutType === 'cart' && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-300 block">
                    Endereço para Envio dos Correios:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="CEP"
                      aria-label="CEP"
                      value={address.cep}
                      onChange={e => setAddress({ ...address, cep: e.target.value })}
                      className="bg-[#111318] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    />
                    <input
                      type="text"
                      placeholder="Rua / Avenida"
                      aria-label="Rua ou Avenida"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      className="col-span-1 sm:col-span-2 bg-[#111318] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    />
                    <input
                      type="text"
                      placeholder="Número"
                      aria-label="Número do endereço"
                      value={address.number}
                      onChange={e => setAddress({ ...address, number: e.target.value })}
                      className="bg-[#111318] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    />
                    <input
                      type="text"
                      placeholder="Bairro"
                      aria-label="Bairro"
                      value={address.neighborhood}
                      onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                      className="bg-[#111318] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    />
                    <input
                      type="text"
                      placeholder="Cidade - UF"
                      aria-label="Cidade e UF"
                      value={`${address.city} - ${address.state}`}
                      onChange={e => {
                        const parts = e.target.value.split('-');
                        setAddress({
                          ...address,
                          city: parts[0]?.trim() || address.city,
                          state: parts[1]?.trim() || address.state
                        });
                      }}
                      className="bg-[#111318] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <span className="text-xs font-semibold text-stone-300 block mb-2">
                  Forma de Pagamento:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition min-h-[44px] ${
                      paymentMethod === 'pix'
                        ? 'border-[#c89b3c] bg-[#222530] text-white shadow-md'
                        : 'border-[#2d313f] bg-[#171922] text-stone-400 hover:border-[#3d4254]'
                    }`}
                  >
                    <QrCode size={16} className="text-[#c89b3c]" aria-hidden="true" />
                    <span>Pix Instantâneo</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">
                      Rápido
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition min-h-[44px] ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#c89b3c] bg-[#222530] text-white shadow-md'
                        : 'border-[#2d313f] bg-[#171922] text-stone-400 hover:border-[#3d4254]'
                    }`}
                  >
                    <CreditCard size={16} className="text-[#c89b3c]" aria-hidden="true" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>
              </div>

              {/* Method Detail */}
              {paymentMethod === 'pix' ? (
                <div className="p-4 rounded-xl bg-[#111318] border border-[#2b2f3d] space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-28 bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center shadow-md">
                      <div className="w-full h-full border-2 border-black grid grid-cols-4 gap-0.5 p-1" aria-hidden="true">
                        <div className="bg-black col-span-2 row-span-2" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-black col-span-2 row-span-2 col-start-3 row-start-3" />
                        <div className="bg-black" />
                        <div className="bg-black col-span-2 row-span-2 col-start-1 row-start-3" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                      <div className="text-xs text-stone-300">
                        1. Abra o app do seu banco ou carteira digital
                      </div>
                      <div className="text-xs text-stone-300">
                        2. Escaneie o QR Code ao lado ou copie o código Pix abaixo
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#242734] hover:bg-[#303444] border border-[#3d4254] text-xs font-medium text-stone-200 transition min-h-[44px]"
                      >
                        {pixCopied ? (
                          <>
                            <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
                            <span className="text-emerald-300 font-semibold">Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={15} className="text-[#c89b3c]" aria-hidden="true" />
                            <span>Copiar Chave Copia e Cola</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-stone-400 font-mono truncate bg-[#0d0e12] p-2.5 rounded-lg border border-[#222530]">
                    {mockPixPayload}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#111318] border border-[#2b2f3d] space-y-3 text-xs">
                  <div>
                    <label htmlFor="card-num" className="text-stone-300 block mb-1">
                      Número do Cartão
                    </label>
                    <input
                      id="card-num"
                      type="text"
                      value={cardData.number}
                      onChange={e => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-[#181a22] border border-[#313544] rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="card-holder" className="text-stone-300 block mb-1">
                        Nome no Cartão
                      </label>
                      <input
                        id="card-holder"
                        type="text"
                        value={cardData.holder}
                        onChange={e => setCardData({ ...cardData, holder: e.target.value })}
                        className="w-full bg-[#181a22] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="card-exp" className="text-stone-300 block mb-1">
                          Validade
                        </label>
                        <input
                          id="card-exp"
                          type="text"
                          value={cardData.expiry}
                          onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-[#181a22] border border-[#313544] rounded-lg p-2.5 text-white font-mono text-center min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvv" className="text-stone-300 block mb-1">
                          CVV
                        </label>
                        <input
                          id="card-cvv"
                          type="text"
                          value={cardData.cvv}
                          onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-[#181a22] border border-[#313544] rounded-lg p-2.5 text-white font-mono text-center min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="card-installments" className="text-stone-300 block mb-1">
                      Parcelamento InfinitePay
                    </label>
                    <select
                      id="card-installments"
                      value={cardData.installments}
                      onChange={e => setCardData({ ...cardData, installments: e.target.value })}
                      className="w-full bg-[#181a22] border border-[#313544] rounded-lg p-2.5 text-white min-h-[44px]"
                    >
                      <option value="1">1x de R$ {totalToPay.toFixed(2)} (sem juros)</option>
                      <option value="2">2x de R$ {(totalToPay / 2).toFixed(2)} (sem juros)</option>
                      <option value="3">3x de R$ {(totalToPay / 3).toFixed(2)} (sem juros)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#a87e28] hover:from-[#d9ab4b] hover:to-[#b88c32] text-black font-semibold text-sm transition shadow-lg shadow-[#c89b3c]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Comunicando com InfinitePay Gateway...</span>
                  </div>
                ) : (
                  <span>Confirmar e Liquidar Pagamento (R$ {totalToPay.toFixed(2)})</span>
                )}
              </button>

              <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" aria-hidden="true" />
                <span>Transação protegida por criptografia TLS 1.3 e conciliação InfinitePay</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
