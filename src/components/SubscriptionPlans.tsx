import React, { useState } from 'react';
import { Check, Sparkles, Shield, Gift, Truck, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SubscriptionPlan } from '../types';

export const SubscriptionPlans: React.FC = () => {
  const { plans, currentUser, startSubscriptionCheckout } = useStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-ink tracking-wide">
          Planos de Assinatura Adversus Omnes
        </h1>
        <p className="text-ink-soft font-serif text-base sm:text-lg italic leading-relaxed">
          Apoie a digitalização de manuscritos raros, acesse o acervo digital protegido sem restrições e desfrute de vantagens exclusivas no acervo físico com envio para todo o Brasil.
        </p>

        {/* Billing cycle switch */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            aria-pressed={billingCycle === 'monthly'}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition min-h-[44px] ${
              billingCycle === 'monthly'
                ? 'bg-rubrica text-paper-800 shadow-lg shadow-rubrica/20'
                : 'bg-paper-600 text-ink-soft hover:text-ink border border-rule'
            }`}
          >
            Cobrança Mensal
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            aria-pressed={billingCycle === 'yearly'}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 min-h-[44px] ${
              billingCycle === 'yearly'
                ? 'bg-rubrica text-paper-800 shadow-lg shadow-rubrica/20'
                : 'bg-paper-600 text-ink-soft hover:text-ink border border-rule'
            }`}
          >
            <span>Cobrança Anual</span>
            <span className="text-[10px] bg-verdete/20 text-verdete border border-verdete/50 px-1.5 rounded">
              2 Meses Grátis
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map(plan => {
          const isCurrentActive = currentUser.activePlan === plan.name;
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly / 12;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl flex flex-col justify-between p-6 sm:p-8 transition-all relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-paper-600 to-paper-700 border-2 border-rubrica shadow-2xl shadow-rubrica/15 scale-105 z-10'
                  : 'bg-paper-700 border border-rule hover:border-rule-strong'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rubrica text-paper-800 font-cinzel text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                  Mais Recomendado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-rubrica">
                    {plan.badge}
                  </span>
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-verdete-tint text-verdete border border-verdete/35">
                      Seu Plano Atual
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-cinzel font-bold text-ink mt-2">{plan.name}</h2>

                <p className="text-xs text-ink-soft font-serif italic mt-2 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-rule-faint">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-ink-soft">R$</span>
                    <span className="text-4xl font-cinzel font-bold text-ink">
                      {price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-ink-soft">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-ink-soft font-mono mt-1">
                      Faturado anualmente (R$ {plan.priceYearly.toFixed(2)})
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-3 text-xs text-ink-soft">
                  <span className="text-xs font-semibold text-ink-soft block uppercase tracking-wider">
                    Benefícios Inclusos:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-paper-400 border border-rule-strong text-rubrica flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-lg bg-paper-400 text-verdete border border-verdete/35 text-xs font-semibold cursor-default min-h-[48px] flex items-center justify-center"
                  >
                    Plano Ativo na sua Conta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startSubscriptionCheckout(plan)}
                    className={`w-full py-3.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg min-h-[48px] ${
                      plan.isPopular
                        ? 'bg-rubrica hover:bg-rubrica-deep text-paper-800 shadow-rubrica/20'
                        : 'bg-paper-400 hover:bg-paper-300 text-ink border border-rule-strong'
                    }`}
                  >
                    <span>Assinar plano</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ / Guarantees micro-box */}
      <div className="border border-rule rounded-xl p-6 bg-paper-400 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-ink-soft">
        <div className="flex items-start gap-3">
          <Shield className="text-rubrica w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink block mb-1">Sem Fidelidade</strong>
            Cancele ou pause sua assinatura a qualquer momento com um único clique em sua conta.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Truck className="text-rubrica w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="mb-1 block text-ink">Rastreio dos Correios</strong>
            Todo envio sai com código de rastreamento, para qualquer estado do país.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Gift className="text-rubrica w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink block mb-1">Curadoria Especial</strong>
            Livros raros higienizados e acondicionados em papel livre de ácido.
          </div>
        </div>
      </div>
    </div>
  );
};
