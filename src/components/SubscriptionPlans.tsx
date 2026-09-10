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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-xs font-mono text-[#c89b3c]">
          <Sparkles size={13} /> Clube do Livro & Preservação Histórica
        </div>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-wide">
          Planos de Assinatura Contraste
        </h1>
        <p className="text-stone-400 font-serif text-base sm:text-lg italic leading-relaxed">
          Apoie a digitalização de manuscritos raros, acesse o acervo digital protegido sem restrições e desfrute de vantagens exclusivas no acervo físico com envio para todo o Brasil.
        </p>

        {/* Billing cycle switch */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-[#c89b3c] text-black shadow-lg shadow-[#c89b3c]/20'
                : 'bg-[#1a1d26] text-stone-400 hover:text-white border border-[#2b2f3e]'
            }`}
          >
            Cobrança Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-[#c89b3c] text-black shadow-lg shadow-[#c89b3c]/20'
                : 'bg-[#1a1d26] text-stone-400 hover:text-white border border-[#2b2f3e]'
            }`}
          >
            <span>Cobrança Anual</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 rounded">
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
                  ? 'bg-gradient-to-b from-[#1c1f2b] to-[#14161f] border-2 border-[#c89b3c] shadow-2xl shadow-[#c89b3c]/15 scale-105 z-10'
                  : 'bg-[#15171e] border border-[#282b38] hover:border-[#3d4255]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c89b3c] text-black font-cinzel text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                  Mais Recomendado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#c89b3c]">
                    {plan.badge}
                  </span>
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Seu Plano Atual
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-cinzel font-bold text-white mt-2">{plan.name}</h3>

                <p className="text-xs text-stone-400 font-serif italic mt-2 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-[#242735]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-stone-400">R$</span>
                    <span className="text-4xl font-cinzel font-bold text-white">
                      {price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-stone-400">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-[11px] text-stone-500 font-mono mt-1">
                      Faturado anualmente (R$ {plan.priceYearly.toFixed(2)})
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-3 text-xs text-stone-300">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                    Benefícios Inclusos:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#202430] border border-[#353a4c] text-[#c89b3c] flex items-center justify-center shrink-0 mt-0.5">
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
                    className="w-full py-3 rounded-lg bg-[#202430] text-emerald-400 border border-emerald-800/40 text-xs font-semibold cursor-default"
                  >
                    Plano Ativo na sua Conta
                  </button>
                ) : (
                  <button
                    onClick={() => startSubscriptionCheckout(plan)}
                    className={`w-full py-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                      plan.isPopular
                        ? 'bg-[#c89b3c] hover:bg-[#d9ab4b] text-black shadow-[#c89b3c]/20'
                        : 'bg-[#222532] hover:bg-[#2e3244] text-white border border-[#373c4e]'
                    }`}
                  >
                    <span>Assinar via InfinitePay</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ / Guarantees micro-box */}
      <div className="border border-[#262a37] rounded-xl p-6 bg-[#13151b] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-400">
        <div className="flex items-start gap-3">
          <Shield className="text-[#c89b3c] w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-1">Sem Fidelidade</strong>
            Cancele ou pause sua assinatura a qualquer momento com um único clique em sua conta.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Truck className="text-[#c89b3c] w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-1">Correios Rastreável</strong>
            Envios físicos protegidos e segurados para todos os estados do Brasil.
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Gift className="text-[#c89b3c] w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-1">Curadoria Especial</strong>
            Livros raros higienizados e acondicionados em papel livre de ácido.
          </div>
        </div>
      </div>
    </div>
  );
};
