import React, { useState } from 'react';
import {
  User,
  Package,
  BookOpen,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    orders,
    catalog,
    openReader,
    setActiveTab,
    cancelSubscription,
    setRole
  } = useStore();

  const [activeTab, setActiveTabLocal] = useState<'plan' | 'orders' | 'library'>('plan');

  // User orders
  const userOrders = orders.filter(
    o => o.userId === currentUser.id || o.customerEmail === currentUser.email
  );

  // User accessible materials
  const accessibleItems = catalog.filter(item => {
    if (item.access === 'free') return true;
    if (currentUser.purchasedItems.includes(item.id)) return true;
    if (currentUser.role === 'subscriber' && item.access === 'exclusive') return true;
    if (currentUser.role === 'admin') return true;
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171922] via-[#14161f] to-[#121319] border border-[#272b38] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#20232e] border-2 border-[#c89b3c] flex items-center justify-center text-[#c89b3c] text-xl font-cinzel font-bold shadow-lg shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-950 text-[#c89b3c] border border-amber-800/50">
                {currentUser.role === 'admin'
                  ? 'Administrador Geral'
                  : currentUser.role === 'subscriber'
                  ? `Membro: ${currentUser.activePlan}`
                  : 'Visitante Registrado'}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick Role Toggle in Customer Area for testing */}
        <div className="flex items-center gap-2 bg-[#0e1014] p-2 rounded-lg border border-[#262a37] text-xs">
          <span className="text-stone-400">Perfil de Teste:</span>
          <button
            type="button"
            onClick={() => setRole('subscriber')}
            className={`px-3.5 py-2.5 rounded-lg transition min-h-[44px] min-w-[84px] flex items-center justify-center ${
              currentUser.role === 'subscriber'
                ? 'bg-[#c89b3c] text-black font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Assinante
          </button>
          <button
            type="button"
            onClick={() => setRole('visitor')}
            className={`px-3.5 py-2.5 rounded-lg transition min-h-[44px] min-w-[84px] flex items-center justify-center ${
              currentUser.role === 'visitor'
                ? 'bg-[#c89b3c] text-black font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Visitante
          </button>
        </div>
      </div>

      {/* Accessible Tabs Menu */}
      <div role="tablist" aria-label="Seções da Conta do Usuário" className="border-b border-[#252834] flex gap-2 text-xs pb-1">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plan'}
          onClick={() => setActiveTabLocal('plan')}
          className={`px-4 py-2.5 rounded-lg font-semibold transition min-h-[44px] flex items-center gap-1.5 ${
            activeTab === 'plan'
              ? 'bg-[#222532] text-[#c89b3c] border border-[#373c4d]'
              : 'text-stone-400 hover:text-white hover:bg-[#1a1d26]'
          }`}
        >
          <Sparkles size={14} aria-hidden="true" />
          <span>Meu Plano de Assinatura</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'orders'}
          onClick={() => setActiveTabLocal('orders')}
          className={`px-4 py-2.5 rounded-lg font-semibold transition min-h-[44px] flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#222532] text-[#c89b3c] border border-[#373c4d]'
              : 'text-stone-400 hover:text-white hover:bg-[#1a1d26]'
          }`}
        >
          <Truck size={14} aria-hidden="true" />
          <span>Pedidos e Rastreamento Correios ({userOrders.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'library'}
          onClick={() => setActiveTabLocal('library')}
          className={`px-4 py-2.5 rounded-lg font-semibold transition min-h-[44px] flex items-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-[#222532] text-[#c89b3c] border border-[#373c4d]'
              : 'text-stone-400 hover:text-white hover:bg-[#1a1d26]'
          }`}
        >
          <BookOpen size={14} aria-hidden="true" />
          <span>Minha Biblioteca Liberada ({accessibleItems.length})</span>
        </button>
      </div>

      {/* Tab Content: Plan */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {currentUser.activePlan ? (
            <div className="p-6 rounded-xl bg-[#15171f] border border-[#272b38] space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">Status da sua Assinatura</span>
                  <h2 className="text-2xl font-cinzel font-bold text-white mt-0.5">
                    Plano {currentUser.activePlan}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={13} aria-hidden="true" /> Ativa
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-[#222530]">
                <div>
                  <span className="text-stone-400 block">Data de Expiração / Próxima Renovação</span>
                  <span className="font-mono text-white text-sm">
                    {currentUser.subscriptionExpiresAt || 'Renovação Automática em 2027'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Forma de Pagamento</span>
                  <span className="font-mono text-white text-sm">InfinitePay (Recorrente)</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#1a1d26] border border-[#2d3242] space-y-2 text-xs">
                <span className="font-semibold text-amber-300 block">Vantagens Ativas no seu Perfil:</span>
                <ul className="space-y-1 text-stone-300">
                  <li>• Acesso irrestrito a todos os documentos do Leitor Protegido com selo de proveniência</li>
                  <li>• Desconto automático exclusivo em livros físicos e raros na sacola</li>
                  <li>• Notificações antecipadas de garimpo de primeiras edições</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('digital')}
                  className="px-4 py-2.5 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition min-h-[44px]"
                >
                  Ir para Acervo Exclusivo
                </button>
                <button
                  type="button"
                  onClick={cancelSubscription}
                  className="text-stone-400 hover:text-red-400 text-xs transition underline min-h-[44px] px-2"
                >
                  Pausar / Cancelar Assinatura
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#15171f] border border-[#272b38] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#20232e] text-[#c89b3c] flex items-center justify-center mx-auto">
                <Sparkles size={24} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-cinzel font-bold text-white">
                Você ainda não possui um plano de assinatura ativo
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Assine agora para desfrutar de acesso ilimitado ao acervo digital exclusivo, leituras protegidas de fac-símiles históricos e até 20% de desconto em todo o acervo físico.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('planos')}
                className="px-5 py-3 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition shadow-lg shadow-[#c89b3c]/20 min-h-[44px]"
              >
                Conhecer os Planos do Clube
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Orders & Correios Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#15171f] border border-[#272b38] text-center text-stone-400 text-xs">
              Você ainda não realizou compras de acervo físico.
            </div>
          ) : (
            userOrders.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-xl bg-[#15171f] border border-[#272b38] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222530] pb-3 text-xs">
                  <div>
                    <span className="text-stone-400">Pedido</span>{' '}
                    <strong className="text-[#c89b3c] font-mono text-sm">{order.id}</strong>
                    <span className="text-stone-400 ml-2 font-mono">
                      ({new Date(order.createdAt).toLocaleDateString('pt-BR')})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      Pagamento Confirmado (InfinitePay)
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.items.map(i => (
                    <div
                      key={i.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1b1e27] border border-[#2a2d3b]"
                    >
                      <img
                        src={i.coverImage}
                        alt={`Capa de ${i.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-14 object-cover rounded border border-[#373c4d]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{i.title}</div>
                        {i.condition && (
                          <div className="text-[10px] text-amber-300 font-mono">{i.condition}</div>
                        )}
                        <div className="text-[11px] text-stone-400">
                          {i.quantity}x R$ {i.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white font-cinzel">
                        R$ {(i.price * i.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Address details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#222530]">
                  <div className="p-3.5 rounded-lg bg-[#101217] border border-[#252834] space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Truck size={15} className="text-[#c89b3c]" aria-hidden="true" />
                      <span>Rastreamento Correios ({order.shippingMethod}):</span>
                    </div>
                    <div className="font-mono text-amber-300 text-sm">{order.trackingCode}</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" /> Objeto postado na agência central — Em trânsito
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#101217] border border-[#252834] space-y-1">
                    <span className="font-semibold text-white block">Endereço de Entrega:</span>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      {order.shippingAddress.street}, {order.shippingAddress.number}{' '}
                      {order.shippingAddress.complement} — {order.shippingAddress.neighborhood}
                      <br />
                      {order.shippingAddress.city} / {order.shippingAddress.state} — CEP:{' '}
                      {order.shippingAddress.cep}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Accessible Digital Library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="text-xs text-stone-400">
            Materiais históricos, fac-símiles e livros digitais desbloqueados para o seu perfil:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#15171f] border border-[#272b38] flex flex-col justify-between gap-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.coverImage}
                    alt={`Capa de ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-20 object-cover rounded border border-[#323644] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#232734] text-stone-300">
                      {item.type === 'physical' ? 'Obra Adquirida' : item.access === 'exclusive' ? 'Acervo Assinante' : 'PDF Aberto'}
                    </span>
                    <h2 className="text-xs font-semibold text-white truncate mt-1">{item.title}</h2>
                    <p className="text-[11px] text-stone-400 truncate">{item.author}</p>
                    <p className="text-[10px] text-[#c89b3c] font-mono">{item.year}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openReader(item)}
                  aria-label={`Abrir ${item.title} no leitor seguro`}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#222532] hover:bg-[#2e3344] text-stone-200 hover:text-white border border-[#353a4c] text-xs font-semibold transition flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Eye size={14} className="text-[#c89b3c]" aria-hidden="true" />
                  <span>Abrir no Leitor Seguro</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
