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
import { Tabs, TabPanel } from './ui/Tabs';
import { EmptyState } from './ui/EmptyState';

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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-ink-650 via-ink-700 to-ink-750 border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-ink-500 border-2 border-gold flex items-center justify-center text-gold text-xl font-cinzel font-bold shadow-lg shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-950 text-gold border border-amber-800/50">
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
        <div className="flex items-center gap-2 bg-ink-850 p-2 rounded-lg border border-line text-xs">
          <span className="text-stone-400">Perfil de Teste:</span>
          <button
            type="button"
            onClick={() => setRole('subscriber')}
            className={`px-3.5 py-2.5 rounded-lg transition min-h-[44px] min-w-[84px] flex items-center justify-center ${
              currentUser.role === 'subscriber'
                ? 'bg-gold text-black font-semibold'
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
                ? 'bg-gold text-black font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Visitante
          </button>
        </div>
      </div>

      <Tabs
        group="conta"
        label="Seções da sua conta"
        value={activeTab}
        onChange={setActiveTabLocal}
        items={[
          { id: 'plan', label: 'Meu plano', icon: <Sparkles size={14} aria-hidden="true" /> },
          {
            id: 'orders',
            label: 'Pedidos e rastreamento',
            labelShort: 'Pedidos',
            icon: <Truck size={14} aria-hidden="true" />,
            count: userOrders.length
          },
          {
            id: 'library',
            label: 'Biblioteca liberada',
            labelShort: 'Biblioteca',
            icon: <BookOpen size={14} aria-hidden="true" />,
            count: accessibleItems.length
          }
        ]}
      />

      {/* Tab Content: Plan */}
      <TabPanel group="conta" id="plan" active={activeTab === 'plan'} className="space-y-6">
          {currentUser.activePlan ? (
            <div className="p-6 rounded-xl bg-ink-700 border border-line space-y-4 max-w-2xl">
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

              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-line-faint">
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

              <div className="p-4 rounded-lg bg-ink-600 border border-line-mid space-y-2 text-xs">
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
                  className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold text-xs transition min-h-[44px]"
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
            <div className="p-8 rounded-xl bg-ink-700 border border-line text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-ink-500 text-gold flex items-center justify-center mx-auto">
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
                className="px-5 py-3 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold text-xs transition shadow-lg shadow-gold/20 min-h-[44px]"
              >
                Conhecer os Planos do Clube
              </button>
            </div>
          )}
      </TabPanel>

      {/* Tab Content: Orders & Correios Tracking */}
      <TabPanel group="conta" id="orders" active={activeTab === 'orders'} className="space-y-4">
          {userOrders.length === 0 ? (
            <EmptyState
              icon={<Package size={22} aria-hidden="true" />}
              title="Nenhum pedido ainda"
              body="Quando um exemplar do acervo físico for adquirido, o pedido aparece aqui com o código de rastreamento e o endereço de entrega."
              action={{ label: 'Ver o acervo físico', onClick: () => setActiveTab('fisico') }}
            />
          ) : (
            userOrders.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-xl bg-ink-700 border border-line space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-faint pb-3 text-xs">
                  <div>
                    <span className="text-stone-400">Pedido</span>{' '}
                    <strong className="text-gold font-mono text-sm">{order.id}</strong>
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
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-ink-600 border border-line"
                    >
                      <img
                        src={i.coverImage}
                        alt={`Capa de ${i.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-14 object-cover rounded border border-line-strong"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-line-faint">
                  <div className="p-3.5 rounded-lg bg-ink-800 border border-line-soft space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Truck size={15} className="text-gold" aria-hidden="true" />
                      <span>Rastreamento Correios ({order.shippingMethod}):</span>
                    </div>
                    <div className="font-mono text-amber-300 text-sm">{order.trackingCode}</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" /> Objeto postado na agência central — Em trânsito
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-ink-800 border border-line-soft space-y-1">
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
      </TabPanel>

      {/* Tab Content: Accessible Digital Library */}
      <TabPanel group="conta" id="library" active={activeTab === 'library'} className="space-y-4">
          <div className="text-xs text-stone-400">
            Materiais históricos, fac-símiles e livros digitais desbloqueados para o seu perfil:
          </div>

          {accessibleItems.length === 0 && (
            <EmptyState
              icon={<BookOpen size={22} aria-hidden="true" />}
              title="Nada liberado para este perfil"
              body="Documentos de domínio público estão sempre abertos; os fac-símiles e materiais exclusivos são liberados pela assinatura."
              action={{ label: 'Conhecer os planos', onClick: () => setActiveTab('planos') }}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-ink-700 border border-line flex flex-col justify-between gap-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.coverImage}
                    alt={`Capa de ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-20 object-cover rounded border border-line-mid shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-ink-450 text-stone-300">
                      {item.type === 'physical' ? 'Obra Adquirida' : item.access === 'exclusive' ? 'Acervo Assinante' : 'PDF Aberto'}
                    </span>
                    <h2 className="text-xs font-semibold text-white truncate mt-1">{item.title}</h2>
                    <p className="text-[11px] text-stone-400 truncate">{item.author}</p>
                    <p className="text-[10px] text-gold font-mono">{item.year}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openReader(item)}
                  aria-label={`Abrir ${item.title} no leitor seguro`}
                  className="w-full py-2.5 px-3 rounded-lg bg-ink-500 hover:bg-ink-350 text-stone-200 hover:text-white border border-line-strong text-xs font-semibold transition flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Eye size={14} className="text-gold" aria-hidden="true" />
                  <span>Abrir no Leitor Seguro</span>
                </button>
              </div>
            ))}
          </div>
      </TabPanel>
    </div>
  );
};
