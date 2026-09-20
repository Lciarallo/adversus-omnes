import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Shield,
  CreditCard,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Truck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Sliders,
  FlaskConical,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CatalogItem } from '../types';
import { Tabs, TabPanel } from './ui/Tabs';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog, ConfirmRequest } from './ui/ConfirmDialog';
import { useToast } from './ui/Toast';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    catalog,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    updateStock,
    plans,
    updatePlan,
    coupons,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    infinitePayConfig,
    updateInfinitePayConfig,
    currentUser
  } = useStore();

  const { notify } = useToast();

  type AdminTab = 'finance' | 'catalog' | 'inventory' | 'plans' | 'coupons' | 'gateway';
  const [activeTab, setActiveTab] = useState<AdminTab>('finance');
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [catalogFormError, setCatalogFormError] = useState<string | null>(null);

  // InfinitePay Form Local State
  const [gatewayForm, setGatewayForm] = useState(infinitePayConfig);
  const [gatewaySavedMsg, setGatewaySavedMsg] = useState(false);

  // New Catalog Item Modal State
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [catalogFormData, setCatalogFormData] = useState({
    title: '',
    author: '',
    year: 1900,
    type: 'physical' as 'physical' | 'digital' | 'historical_doc',
    access: 'sale' as 'free' | 'exclusive' | 'sale',
    price: 150,
    stock: 1,
    condition: 'Raro / Peça Única',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: '',
    pages: 250,
    publisher: 'Tipografia Nacional',
    politicalMovement: 'Liberalismo Clássico',
    period: 'Século XIX',
    event: ''
  });

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponDate, setNewCouponDate] = useState('2026-12-31');

  // Métricas derivadas do estado real do protótipo. Nada aqui é estimado:
  // um número inventado num painel é lido como fato por quem assiste à demo.
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalPhysicalOrders = orders.length;
  const lowStockItems = catalog.filter(c => c.type === 'physical' && c.stock <= 1);
  const physicalCount = catalog.filter(c => c.type === 'physical').length;
  const digitalCount = catalog.length - physicalCount;

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    updateInfinitePayConfig(gatewayForm);
    setGatewaySavedMsg(true);
    setTimeout(() => setGatewaySavedMsg(false), 3000);
  };

  const handleOpenCatalogModal = (item?: CatalogItem) => {
    if (item) {
      setEditingItem(item);
      setCatalogFormData({
        title: item.title,
        author: item.author,
        year: item.year,
        type: item.type,
        access: item.access,
        price: item.price,
        stock: item.stock,
        condition: item.condition || 'Raro / Peça Única',
        coverImage: item.coverImage,
        description: item.description,
        pages: item.pages,
        publisher: item.publisher || '',
        politicalMovement: item.politicalMovement,
        period: item.period,
        event: item.event || ''
      });
    } else {
      setEditingItem(null);
      setCatalogFormData({
        title: '',
        author: '',
        year: 1900,
        type: 'physical',
        access: 'sale',
        price: 150,
        stock: 1,
        condition: 'Raro / Peça Única',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        description: '',
        pages: 250,
        publisher: 'Tipografia Nacional',
        politicalMovement: 'Liberalismo Clássico',
        period: 'Século XIX',
        event: ''
      });
    }
    setIsCatalogModalOpen(true);
  };

  const handleSaveCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogFormData.title.trim()) {
      setCatalogFormError('O título é obrigatório: é por ele que a obra aparece no catálogo e nas buscas.');
      return;
    }
    setCatalogFormError(null);

    const payload = {
      ...catalogFormData,
      condition: catalogFormData.condition as any
    };

    if (editingItem) {
      updateCatalogItem(editingItem.id, payload);
    } else {
      addCatalogItem(payload);
    }

    setIsCatalogModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      validUntil: newCouponDate,
      active: true
    });
    setNewCouponCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
            Dashboard Administrativo
          </h1>
          <p className="text-stone-400 font-serif italic text-sm max-w-2xl leading-relaxed">
            Monitoramento financeiro, estoque de livros raros, gestão de planos e configuração do gateway InfinitePay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-950/70 px-3 py-1.5 font-mono text-xs text-amber-300">
            <FlaskConical size={12} aria-hidden="true" />
            <span>Dados de demonstração</span>
          </span>
        </div>
      </div>

      {/* KPI Cards — todos calculados a partir do catálogo e dos pedidos em memória */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 rounded-xl border border-line bg-ink-700 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Faturamento dos pedidos</span>
            <DollarSign size={16} className="text-gold" aria-hidden="true" />
          </div>
          <div className="font-cinzel text-2xl font-bold tabular-nums text-white">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="pt-1 font-mono text-[11px] text-stone-400">
            Soma dos pedidos registrados
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-line bg-ink-700 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Pedidos registrados</span>
            <Truck size={16} className="text-blue-400" aria-hidden="true" />
          </div>
          <div className="font-cinzel text-2xl font-bold tabular-nums text-white">
            {totalPhysicalOrders}
          </div>
          <div className="pt-1 font-mono text-[11px] text-stone-400">
            Envio por SEDEX e PAC
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-line bg-ink-700 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Acervo catalogado</span>
            <Layers size={16} className="text-gold" aria-hidden="true" />
          </div>
          <div className="font-cinzel text-2xl font-bold tabular-nums text-white">
            {catalog.length}
          </div>
          <div className="pt-1 font-mono text-[11px] text-stone-400">
            {physicalCount} físicas · {digitalCount} digitais
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-line bg-ink-700 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Estoque crítico (1 un.)</span>
            <AlertTriangle size={16} className="text-orange-400" aria-hidden="true" />
          </div>
          <div className="font-cinzel text-2xl font-bold tabular-nums text-orange-300">
            {lowStockItems.length}
          </div>
          <div className="pt-1 font-mono text-[11px] text-stone-400">
            Peças únicas ou raras
          </div>
        </div>
      </div>

      <p className="-mt-4 text-xs leading-relaxed text-stone-400">
        Receita recorrente e número de assinantes aparecem aqui quando houver base de assinantes —
        hoje o protótipo não tem essa informação, e estimá-la seria inventar um número.
      </p>

      <Tabs
        group="admin"
        label="Seções do painel administrativo"
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { id: 'finance', label: 'Faturamento e pedidos', labelShort: 'Faturamento' },
          { id: 'catalog', label: 'Gestão de catálogo', labelShort: 'Catálogo' },
          { id: 'inventory', label: 'Estoque e inventário', labelShort: 'Estoque' },
          { id: 'plans', label: 'Planos de assinatura', labelShort: 'Planos' },
          { id: 'coupons', label: 'Cupons promocionais', labelShort: 'Cupons' },
          {
            id: 'gateway',
            label: 'Configuração InfinitePay',
            labelShort: 'InfinitePay',
            icon: <CreditCard size={13} aria-hidden="true" />
          }
        ]}
      />

      {/* Tab 1: Faturamento & Pedidos */}
      <TabPanel group="admin" id="finance" active={activeTab === 'finance'} className="space-y-6">
          <div className="p-5 rounded-xl bg-ink-700 border border-line space-y-4">
            <h2 className="text-base font-cinzel font-bold text-white">
              Histórico de Vendas e Pedidos Realizados
            </h2>

            <div className="text-xs text-stone-400 sm:hidden flex items-center gap-1.5 py-1">
              <span>Deslize a tabela para o lado para ver todos os campos</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[720px] text-left text-xs text-stone-300">
                <thead className="bg-ink-800 text-stone-400 uppercase text-[10px] tracking-wider border-b border-line-soft">
                  <tr>
                    <th scope="col" className="p-3">ID Pedido</th>
                    <th scope="col" className="p-3">Cliente</th>
                    <th scope="col" className="p-3">Itens</th>
                    <th scope="col" className="p-3">Total</th>
                    <th scope="col" className="p-3">Gateway</th>
                    <th scope="col" className="p-3">Status</th>
                    <th scope="col" className="p-3">Rastreio Correios</th>
                    <th scope="col" className="p-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-faint">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-ink-600">
                      <td className="p-3 font-mono text-gold font-semibold">{order.id}</td>
                      <td className="p-3">
                        <div className="font-medium text-white">{order.customerName}</div>
                        <div className="text-[10px] text-stone-400">{order.customerEmail}</div>
                      </td>
                      <td className="p-3">
                        {order.items.map(i => (
                          <div key={i.id} className="truncate max-w-xs">
                            {i.quantity}x {i.title}
                          </div>
                        ))}
                      </td>
                      <td className="p-3 font-cinzel font-bold text-white">
                        R$ {order.total.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-[11px] uppercase">
                        InfinitePay ({order.paymentMethod})
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                          Liquidado
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-amber-300">
                        {order.trackingCode} ({order.shippingMethod})
                      </td>
                      <td className="p-3 text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </TabPanel>

      {/* Tab 2: Gestão de Catálogo */}
      <TabPanel group="admin" id="catalog" active={activeTab === 'catalog'} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-cinzel font-bold text-white">
              Catálogo Geral (Físico & Digital)
            </h2>
            <button
              type="button"
              onClick={() => handleOpenCatalogModal()}
              className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold text-xs flex items-center gap-1.5 transition min-h-[44px]"
            >
              <Plus size={15} aria-hidden="true" /> Cadastrar Nova Obra / Documento
            </button>
          </div>

          <div className="text-xs text-stone-400 sm:hidden flex items-center gap-1.5 py-1">
            <span>Deslize a tabela para o lado para ver todos os campos</span>
          </div>
          <div className="overflow-x-auto bg-ink-700 border border-line rounded-xl">
            <table className="w-full min-w-[720px] text-left text-xs text-stone-300">
              <thead className="bg-ink-800 text-stone-400 uppercase text-[10px] tracking-wider border-b border-line-soft">
                <tr>
                  <th scope="col" className="p-3">Capa</th>
                  <th scope="col" className="p-3">Título & Autor</th>
                  <th scope="col" className="p-3">Tipo / Acesso</th>
                  <th scope="col" className="p-3">Movimento / Período</th>
                  <th scope="col" className="p-3">Preço</th>
                  <th scope="col" className="p-3">Estoque</th>
                  <th scope="col" className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-faint">
                {catalog.map(item => (
                  <tr key={item.id} className="hover:bg-ink-600">
                    <td className="p-3">
                      <img
                        src={item.coverImage}
                        alt={`Capa do exemplar ${item.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-14 object-cover rounded border border-line-mid"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-stone-400">{item.author} ({item.year})</div>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {item.type === 'physical' ? (
                        <span className="text-amber-300">Físico ({item.condition})</span>
                      ) : item.access === 'exclusive' ? (
                        <span className="text-purple-300">Digital Protegido</span>
                      ) : (
                        <span className="text-emerald-300">Digital Aberto</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-400">
                      {item.politicalMovement} • {item.period}
                    </td>
                    <td className="p-3 font-cinzel font-bold text-white">
                      {item.price > 0 ? `R$ ${item.price.toFixed(2)}` : 'Incluso'}
                    </td>
                    <td className="p-3 font-mono">
                      {item.type === 'physical' ? (
                        <span className={item.stock <= 1 ? 'text-red-400 font-bold' : 'text-stone-300'}>
                          {item.stock} un.
                        </span>
                      ) : (
                        <span className="text-dust">Ilimitado</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenCatalogModal(item)}
                          aria-label={`Editar obra ${item.title}`}
                          className="p-2.5 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                        >
                          <Edit2 size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmRequest({
                              title: 'Remover esta obra do catálogo?',
                              body: `"${item.title}" sai do acervo, deixa de aparecer nas buscas e nas fichas de autor, e o estoque registrado é perdido. Não há como desfazer.`,
                              confirmLabel: 'Remover obra',
                              onConfirm: () => {
                                deleteCatalogItem(item.id);
                                notify(`"${item.title}" foi removida do catálogo.`, 'info');
                              }
                            })
                          }
                          aria-label={`Excluir obra ${item.title}`}
                          className="p-2.5 rounded-lg text-dust hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </TabPanel>

      {/* Tab 3: Estoque & Inventário com alvos de toque maiores */}
      <TabPanel group="admin" id="inventory" active={activeTab === 'inventory'} className="p-5 rounded-xl bg-ink-700 border border-line space-y-4">
          <h2 className="text-base font-cinzel font-bold text-white">
            Ajuste Rápido de Estoque Unitário
          </h2>
          <p className="text-xs text-stone-400">
            Ajuste rápido de unidades disponíveis para venda imediata. Obras raras de colecionador geralmente possuem estoque unitário (1).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalog
              .filter(c => c.type === 'physical')
              .map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-ink-600 border border-line flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.coverImage}
                      alt={`Capa de ${item.title}`}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-16 object-cover rounded border border-line-strong shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-stone-400">{item.condition}</p>
                      <p className="text-xs text-gold font-bold">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Accessible 44x44px stepper buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, -1)}
                      aria-label={`Diminuir estoque de ${item.title}`}
                      className="min-w-[44px] min-h-[44px] rounded-lg bg-ink-450 hover:bg-ink-350 text-stone-200 flex items-center justify-center font-bold text-base transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-mono font-bold text-white">
                      {item.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, 1)}
                      aria-label={`Aumentar estoque de ${item.title}`}
                      className="min-w-[44px] min-h-[44px] rounded-lg bg-ink-450 hover:bg-ink-350 text-stone-200 flex items-center justify-center font-bold text-base transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
      </TabPanel>

      {/* Tab 4: Planos de Assinatura */}
      <TabPanel group="admin" id="plans" active={activeTab === 'plans'} className="p-5 rounded-xl bg-ink-700 border border-line space-y-4">
          <h2 className="text-base font-cinzel font-bold text-white">
            Administração dos Planos de Assinatura
          </h2>
          <p className="text-xs text-stone-400">
            Altere preços mensais/anuais e características dos planos do clube.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div
                key={plan.id}
                className="p-4 rounded-lg bg-ink-600 border border-line space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{plan.name}</span>
                  <span className="text-gold font-mono">{plan.badge}</span>
                </div>

                <div>
                  <label htmlFor={`price-monthly-${plan.id}`} className="text-stone-400 block mb-1">
                    Preço Mensal (R$)
                  </label>
                  <input
                    id={`price-monthly-${plan.id}`}
                    type="number"
                    step="0.1"
                    value={plan.priceMonthly}
                    onChange={e => updatePlan(plan.id, { priceMonthly: Number(e.target.value) })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label htmlFor={`price-yearly-${plan.id}`} className="text-stone-400 block mb-1">
                    Preço Anual (R$)
                  </label>
                  <input
                    id={`price-yearly-${plan.id}`}
                    type="number"
                    step="1"
                    value={plan.priceYearly}
                    onChange={e => updatePlan(plan.id, { priceYearly: Number(e.target.value) })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label htmlFor={`desc-${plan.id}`} className="text-stone-400 block mb-1">
                    Descrição do Plano
                  </label>
                  <textarea
                    id={`desc-${plan.id}`}
                    rows={2}
                    value={plan.description}
                    onChange={e => updatePlan(plan.id, { description: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
      </TabPanel>

      {/* Tab 5: Cupons Promocionais */}
      <TabPanel group="admin" id="coupons" active={activeTab === 'coupons'} className="space-y-6">
          <div className="p-5 rounded-xl bg-ink-700 border border-line space-y-4">
            <h2 className="text-base font-cinzel font-bold text-white">Criar Novo Cupom</h2>
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="CÓDIGO (ex: NOVO25)"
                aria-label="Código promocional"
                value={newCouponCode}
                onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                className="bg-ink-800 border border-line-mid rounded p-2 text-white uppercase font-mono min-h-[44px]"
              />
              <input
                type="number"
                placeholder="% de Desconto"
                aria-label="Porcentagem de desconto"
                value={newCouponDiscount}
                onChange={e => setNewCouponDiscount(Number(e.target.value))}
                className="bg-ink-800 border border-line-mid rounded p-2 text-white font-mono min-h-[44px]"
              />
              <input
                type="date"
                aria-label="Data de validade do cupom"
                value={newCouponDate}
                onChange={e => setNewCouponDate(e.target.value)}
                className="bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-light text-black font-semibold rounded px-4 py-2 transition min-h-[44px]"
              >
                Cadastrar Cupom
              </button>
            </form>
          </div>

          <div className="overflow-x-auto bg-ink-700 border border-line rounded-xl">
            <table className="w-full min-w-[620px] text-left text-xs text-stone-300">
              <thead className="bg-ink-800 text-stone-400 uppercase text-[10px] tracking-wider border-b border-line-soft">
                <tr>
                  <th scope="col" className="p-3">Código</th>
                  <th scope="col" className="p-3">Desconto</th>
                  <th scope="col" className="p-3">Validade</th>
                  <th scope="col" className="p-3">Status</th>
                  <th scope="col" className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-faint">
                {coupons.map(c => (
                  <tr key={c.code} className="hover:bg-ink-600">
                    <td className="p-3 font-mono font-bold text-gold">{c.code}</td>
                    <td className="p-3 font-bold text-white">{c.discountPercentage}% OFF</td>
                    <td className="p-3 text-stone-400">{c.validUntil}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          c.active
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {c.active ? 'Ativo' : 'Pausado'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleCoupon(c.code)}
                        className="text-stone-400 hover:text-white text-xs min-h-[44px] px-2"
                      >
                        {c.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmRequest({
                            title: `Excluir o cupom ${c.code}?`,
                            body: `Quem já tiver o código deixa de conseguir aplicá-lo na sacola. Para suspender sem apagar, use "Desativar".`,
                            confirmLabel: 'Excluir cupom',
                            onConfirm: () => {
                              deleteCoupon(c.code);
                              notify(`Cupom ${c.code} excluído.`, 'info');
                            }
                          })
                        }
                        className="min-h-[44px] px-2 text-xs text-red-400 transition hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </TabPanel>

      {/* Tab 6: Configuração Gateway InfinitePay */}
      <TabPanel group="admin" id="gateway" active={activeTab === 'gateway'} className="p-6 rounded-xl bg-ink-700 border border-line space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ink-550 border border-line-mid flex items-center justify-center text-gold">
                <CreditCard size={20} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-cinzel font-bold text-white">
                  Integração com Gateway InfinitePay
                </h2>
                <p className="text-xs leading-relaxed text-stone-400">
                  Campos preparados para a integração. Neste protótipo os valores ficam salvos apenas
                  neste navegador e nenhuma cobrança é processada.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-amber-800/40 bg-amber-950 px-3 py-1 font-mono text-xs text-amber-300">
              {gatewayForm.mode === 'sandbox' ? 'Sandbox' : 'Produção'}
            </span>
          </div>

          <form onSubmit={handleSaveGateway} className="space-y-4 text-xs max-w-2xl">
            <div>
              <label htmlFor="gateway-mode" className="text-stone-300 block mb-1">
                Ambiente de Operação
              </label>
              <select
                id="gateway-mode"
                value={gatewayForm.mode}
                onChange={e => setGatewayForm({ ...gatewayForm, mode: e.target.value as any })}
                className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
              >
                <option value="sandbox">Sandbox — simulação de Pix e cartão</option>
                <option value="production">Produção — exige a conta InfinitePay contratada</option>
              </select>
            </div>

            <div>
              <label htmlFor="gateway-merchant" className="text-stone-300 block mb-1">
                InfinitePay Merchant ID
              </label>
              <input
                id="gateway-merchant"
                type="text"
                value={gatewayForm.merchantId}
                onChange={e => setGatewayForm({ ...gatewayForm, merchantId: e.target.value })}
                className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="gateway-api-key" className="text-stone-300 block mb-1">
                Chave de API
              </label>
              <input
                id="gateway-api-key"
                type="password"
                autoComplete="off"
                spellCheck={false}
                aria-describedby="gateway-api-key-nota"
                value={gatewayForm.apiKey}
                onChange={e => setGatewayForm({ ...gatewayForm, apiKey: e.target.value })}
                className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white font-mono min-h-[44px]"
              />
              <p id="gateway-api-key-nota" className="mt-1.5 text-[11px] leading-relaxed text-dust">
                Guardada apenas neste navegador, sem criptografia. Não use uma chave de produção
                enquanto o protótipo não tiver servidor.
              </p>
            </div>

            <div>
              <label htmlFor="gateway-wallet" className="text-stone-300 block mb-1">
                InfinitePay Wallet ID / Chave Pix de Liquidação
              </label>
              <input
                id="gateway-wallet"
                type="text"
                value={gatewayForm.walletId}
                onChange={e => setGatewayForm({ ...gatewayForm, walletId: e.target.value })}
                className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="gateway-webhook" className="text-stone-300 block mb-1">
                URL de Webhook (Notificação de Pagamento Instantâneo)
              </label>
              <input
                id="gateway-webhook"
                type="url"
                value={gatewayForm.webhookUrl}
                onChange={e => setGatewayForm({ ...gatewayForm, webhookUrl: e.target.value })}
                className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white font-mono min-h-[44px]"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold text-xs transition flex items-center gap-1.5 shadow min-h-[44px]"
              >
                <Save size={15} aria-hidden="true" />
                <span>Salvar Configurações InfinitePay</span>
              </button>

              {gatewaySavedMsg && (
                <span role="status" className="text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle size={14} aria-hidden="true" /> Configurações salvas com sucesso!
                </span>
              )}
            </div>
          </form>
      </TabPanel>

      {/* Catalog Modal */}
      <Dialog
        open={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        labelledBy="catalog-modal-title"
        panelClassName="w-full max-w-xl space-y-4 rounded-xl border border-line-mid bg-ink-700 p-6 shadow-2xl max-h-[90svh] overflow-y-auto"
      >
            <h2 id="catalog-modal-title" className="text-base font-cinzel font-bold text-white border-b border-line-soft pb-2">
              {editingItem ? 'Editar Obra do Catálogo' : 'Adicionar Nova Obra ao Catálogo'}
            </h2>

            <form onSubmit={handleSaveCatalogItem} className="space-y-3 text-xs">
              <div>
                <label htmlFor="cat-title" className="text-stone-300 block mb-1">
                  Título da Obra *
                </label>
                <input
                  id="cat-title"
                  type="text"
                  required
                  aria-invalid={!!catalogFormError}
                  aria-describedby={catalogFormError ? 'cat-title-erro' : undefined}
                  value={catalogFormData.title}
                  onChange={e => {
                    setCatalogFormData({ ...catalogFormData, title: e.target.value });
                    if (catalogFormError) setCatalogFormError(null);
                  }}
                  className={`min-h-[44px] w-full rounded border bg-ink-800 p-2 text-white ${
                    catalogFormError ? 'border-red-700' : 'border-line-mid'
                  }`}
                />
                {catalogFormError && (
                  <p id="cat-title-erro" role="alert" className="mt-1.5 text-[11px] text-red-300">
                    {catalogFormError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cat-author" className="text-stone-300 block mb-1">
                    Autor
                  </label>
                  <input
                    id="cat-author"
                    type="text"
                    value={catalogFormData.author}
                    onChange={e => setCatalogFormData({ ...catalogFormData, author: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="cat-year" className="text-stone-300 block mb-1">
                    Ano Histórico
                  </label>
                  <input
                    id="cat-year"
                    type="number"
                    value={catalogFormData.year}
                    onChange={e => setCatalogFormData({ ...catalogFormData, year: Number(e.target.value) })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="cat-type" className="text-stone-300 block mb-1">
                    Tipo de Obra
                  </label>
                  <select
                    id="cat-type"
                    value={catalogFormData.type}
                    onChange={e => setCatalogFormData({ ...catalogFormData, type: e.target.value as any })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                  >
                    <option value="physical">Acervo Físico (Livro)</option>
                    <option value="digital">Acervo Digital</option>
                    <option value="historical_doc">Documento Histórico</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cat-access" className="text-stone-300 block mb-1">
                    Acesso
                  </label>
                  <select
                    id="cat-access"
                    value={catalogFormData.access}
                    onChange={e => setCatalogFormData({ ...catalogFormData, access: e.target.value as any })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                  >
                    <option value="sale">À Venda (E-commerce)</option>
                    <option value="exclusive">Exclusivo Assinantes</option>
                    <option value="free">Livre / Domínio Público</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cat-price" className="text-stone-300 block mb-1">
                    Preço (R$)
                  </label>
                  <input
                    id="cat-price"
                    type="number"
                    step="0.01"
                    value={catalogFormData.price}
                    onChange={e => setCatalogFormData({ ...catalogFormData, price: Number(e.target.value) })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cat-stock" className="text-stone-300 block mb-1">
                    Estoque Físico
                  </label>
                  <input
                    id="cat-stock"
                    type="number"
                    value={catalogFormData.stock}
                    onChange={e => setCatalogFormData({ ...catalogFormData, stock: Number(e.target.value) })}
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="cat-condition" className="text-stone-300 block mb-1">
                    Condição do Exemplar
                  </label>
                  <input
                    id="cat-condition"
                    type="text"
                    value={catalogFormData.condition}
                    onChange={e => setCatalogFormData({ ...catalogFormData, condition: e.target.value })}
                    placeholder="Ex: Raro / Peça Única, Usado - Excelente"
                    className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cat-cover" className="text-stone-300 block mb-1">
                  URL da Imagem da Capa
                </label>
                <input
                  id="cat-cover"
                  type="url"
                  value={catalogFormData.coverImage}
                  onChange={e => setCatalogFormData({ ...catalogFormData, coverImage: e.target.value })}
                  className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="cat-desc" className="text-stone-300 block mb-1">
                  Descrição Arquivística / Sinopse
                </label>
                <textarea
                  id="cat-desc"
                  rows={3}
                  value={catalogFormData.description}
                  onChange={e => setCatalogFormData({ ...catalogFormData, description: e.target.value })}
                  className="w-full bg-ink-800 border border-line-mid rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatalogModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-ink-500 text-stone-300 min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold min-h-[44px]"
                >
                  Salvar Obra
                </button>
              </div>
        </form>
      </Dialog>

      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
    </div>
  );
};
