import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Author,
  Article,
  CatalogItem,
  SubscriptionPlan,
  User,
  CartItem,
  Order,
  Coupon,
  CorreiosQuote,
  InfinitePayConfig,
  UserRole,
  ShippingAddress
} from '../types';
import {
  INITIAL_AUTHORS,
  INITIAL_ARTICLES,
  INITIAL_CATALOG,
  INITIAL_PLANS,
  INITIAL_COUPONS,
  INITIAL_INFINITEPAY_CONFIG,
  INITIAL_ORDERS
} from '../data/initialData';
import { useToast } from '../components/ui/Toast';
import { addMonths, toDateOnly, todayDateOnly } from '../utils/format';

export type BillingCycle = 'monthly' | 'yearly';

const FREE_SHIPPING_PLAN = 'Membro do Círculo';

const SUBSCRIBER_RATES: Record<string, number> = {
  'Membro do Círculo': 0.2,
  Pesquisador: 0.15
};

/** Motivo pelo qual um cupom não vale para este subtotal, ou null se vale. */
export const couponProblem = (coupon: Coupon, subtotal: number): string | null => {
  if (!coupon.active) return `O cupom ${coupon.code} está pausado.`;
  if (coupon.validUntil && coupon.validUntil < todayDateOnly()) {
    return `O cupom ${coupon.code} expirou.`;
  }
  if (coupon.minAmount && subtotal < coupon.minAmount) {
    return `O cupom ${coupon.code} vale para compras a partir de R$ ${coupon.minAmount.toFixed(2)}.`;
  }
  return null;
};

interface StoreContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedReaderItem: CatalogItem | null;
  openReader: (item: CatalogItem) => void;
  transitioningCoverId: string | null;
  setTransitioningCoverId: (id: string | null) => void;
  selectedAuthor: Author | null;
  setSelectedAuthor: (author: Author | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;

  // User & Auth
  currentUser: User;
  setRole: (role: UserRole) => void;
  subscribeUser: (planName: string, cycle: BillingCycle) => void;
  cancelSubscription: () => void;

  // Authors CRUD
  authors: Author[];
  addAuthor: (author: Omit<Author, 'id'>) => void;
  updateAuthor: (id: string, updated: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;

  // Articles CRUD
  articles: Article[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, updated: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // Catalog & Inventory CRUD
  catalog: CatalogItem[];
  addCatalogItem: (item: Omit<CatalogItem, 'id'>) => void;
  updateCatalogItem: (id: string, updated: Partial<CatalogItem>) => void;
  deleteCatalogItem: (id: string) => void;
  updateStock: (id: string, delta: number) => void;

  // Cart & Shipping
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: CatalogItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  discountAmount: number;
  subscriberDiscount: number;
  subscriberRate: number;
  hasFreeShipping: boolean;
  shippingCost: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedShipping: CorreiosQuote | null;
  setSelectedShipping: (quote: CorreiosQuote | null) => void;
  calculateShipping: (cep: string) => CorreiosQuote[];

  // Plans
  plans: SubscriptionPlan[];
  updatePlan: (id: string, updated: Partial<SubscriptionPlan>) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Orders
  orders: Order[];
  createOrder: (data: { address: ShippingAddress; paymentMethod: 'pix' | 'credit_card' }) => Order;

  // InfinitePay
  infinitePayConfig: InfinitePayConfig;
  updateInfinitePayConfig: (config: Partial<InfinitePayConfig>) => void;
  isInfinitePayModalOpen: boolean;
  setIsInfinitePayModalOpen: (open: boolean) => void;
  checkoutType: 'cart' | 'subscription';
  checkoutPlan: SubscriptionPlan | null;
  checkoutCycle: BillingCycle;
  startCartCheckout: () => void;
  startSubscriptionCheckout: (plan: SubscriptionPlan, cycle?: BillingCycle) => void;
}

export const transitionState = (fn: () => void) => {
  if (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    // Duas transições seguidas (ex.: escolher autor e trocar de seção)
    // pulam a primeira; o estado é aplicado mesmo assim, então a rejeição
    // "Transition was skipped" é esperada e não deve vazar como erro.
    const transition = (document as any).startViewTransition(fn);
    transition.ready?.catch(() => {});
    transition.finished?.catch(() => {});
    transition.updateCallbackDone?.catch(() => {});
  } else {
    fn();
  }
};

/* ------------------------------------------------------------------ *
 * Persistência local: nunca pode derrubar a abertura do acervo.       *
 * JSON corrompido, cota esgotada ou navegação privada são condições   *
 * normais, não exceções — e a versão do esquema garante que uma       *
 * semente nova alcance quem já visitou o site antes.                  *
 * ------------------------------------------------------------------ */

const STORAGE_VERSION = '5';
const storageKey = (name: string) => `contraste_${name}`;

const resetStaleStorage = () => {
  try {
    if (localStorage.getItem('contraste_schema') === STORAGE_VERSION) return;
    Object.keys(localStorage)
      .filter(key => key.startsWith('contraste_'))
      .forEach(key => localStorage.removeItem(key));
    localStorage.setItem('contraste_schema', STORAGE_VERSION);
  } catch {
    // Sem armazenamento disponível: a aplicação segue com a semente.
  }
};

if (typeof window !== 'undefined') resetStaleStorage();

function readStored<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(name));
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : (parsed as T);
  } catch {
    try {
      localStorage.removeItem(storageKey(name));
    } catch {
      // Nada a fazer: segue com a semente.
    }
    return fallback;
  }
}

function usePersistentState<T>(name: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStored(name, fallback));
  const mounted = useRef(false);

  useEffect(() => {
    // A primeira renderização acabou de ler daqui: regravar seria só custo.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    try {
      localStorage.setItem(storageKey(name), JSON.stringify(value));
    } catch {
      // Cota esgotada ou modo privado: o estado continua válido em memória.
    }
  }, [name, value]);

  return [value, setValue] as const;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const VISITOR: User = {
  id: 'user-visitor',
  name: 'Visitante da Biblioteca',
  email: 'leitor@adversusomnes.com.br',
  role: 'visitor',
  purchasedItems: []
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useToast();

  // Navigation with View Transitions
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedReaderItem, setSelectedReaderItem] = useState<CatalogItem | null>(null);
  const [selectedAuthor, setSelectedAuthorState] = useState<Author | null>(null);
  const [selectedArticle, setSelectedArticleState] = useState<Article | null>(null);
  const [transitioningCoverId, setTransitioningCoverId] = useState<string | null>(null);

  const setActiveTab = useCallback((tab: string) => {
    transitionState(() => {
      setActiveTabState(tab);
      window.scrollTo({ top: 0 });
    });
  }, []);

  const setSelectedAuthor = useCallback((author: Author | null) => {
    transitionState(() => {
      setSelectedAuthorState(author);
      window.scrollTo({ top: 0 });
    });
  }, []);

  const setSelectedArticle = useCallback((article: Article | null) => {
    transitionState(() => {
      setSelectedArticleState(article);
      window.scrollTo({ top: 0 });
    });
  }, []);

  // Estado persistido
  const [currentUser, setCurrentUser] = usePersistentState<User>('user', {
    ...VISITOR,
    id: 'user-default',
    purchasedItems: ['cat-1']
  });
  const [authors, setAuthors] = usePersistentState<Author[]>('authors', INITIAL_AUTHORS);
  const [articles, setArticles] = usePersistentState<Article[]>('articles', INITIAL_ARTICLES);
  const [catalog, setCatalog] = usePersistentState<CatalogItem[]>('catalog', INITIAL_CATALOG);
  const [plans, setPlans] = usePersistentState<SubscriptionPlan[]>('plans', INITIAL_PLANS);
  const [coupons, setCoupons] = usePersistentState<Coupon[]>('coupons', INITIAL_COUPONS);
  const [orders, setOrders] = usePersistentState<Order[]>('orders', INITIAL_ORDERS);
  const [infinitePayConfig, setInfinitePayConfig] = usePersistentState<InfinitePayConfig>(
    'infinitepay',
    INITIAL_INFINITEPAY_CONFIG
  );
  const [cart, setCart] = usePersistentState<CartItem[]>('cart', []);

  // Estado de sessão
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<CorreiosQuote | null>(null);
  const [isInfinitePayModalOpen, setIsInfinitePayModalOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'cart' | 'subscription'>('cart');
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [checkoutCycle, setCheckoutCycle] = useState<BillingCycle>('monthly');

  // Link compartilhado de ensaio (?ensaio=slug): abre o texto direto.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('ensaio');
    if (!slug) return;
    const shared = articles.find(a => a.slug === slug && a.status === 'published');
    if (shared) {
      setSelectedArticleState(shared);
      setActiveTabState('artigos');
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    // Só na abertura: o parâmetro é consumido uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth / Role switcher
  const setRole = useCallback(
    (role: UserRole) => {
      if (role === 'admin') {
        setCurrentUser({
          id: 'admin-master',
          name: 'Administrador Adversus Omnes',
          email: 'diretoria@adversusomnes.com.br',
          role: 'admin',
          activePlan: 'Membro do Círculo',
          purchasedItems: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5']
        });
      } else if (role === 'subscriber') {
        setCurrentUser({
          id: 'user-subscriber',
          name: 'Dra. Helena Magalhães',
          email: 'helena.magalhaes@universidade.edu.br',
          role: 'subscriber',
          activePlan: 'Pesquisador',
          subscriptionExpiresAt: '2027-03-15',
          purchasedItems: ['cat-1', 'cat-8', 'cat-10']
        });
      } else {
        setCurrentUser(VISITOR);
      }
    },
    [setCurrentUser]
  );

  // Assinar ou cancelar mexe no plano, nunca rebaixa um administrador.
  const subscribeUser = useCallback(
    (planName: string, cycle: BillingCycle) => {
      const expiresAt = addMonths(new Date(), cycle === 'yearly' ? 12 : 1);
      setCurrentUser(prev => ({
        ...prev,
        role: prev.role === 'admin' ? 'admin' : 'subscriber',
        activePlan: planName,
        subscriptionExpiresAt: toDateOnly(expiresAt)
      }));
    },
    [setCurrentUser]
  );

  const cancelSubscription = useCallback(() => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'admin' : 'visitor',
      activePlan: undefined,
      subscriptionExpiresAt: undefined
    }));
    notify('Assinatura pausada. Seu acesso ao acervo exclusivo foi encerrado.', 'info');
  }, [notify, setCurrentUser]);

  // Open reader with shared element transition
  const openReader = useCallback((item: CatalogItem) => {
    setTransitioningCoverId(item.id);
    transitionState(() => {
      setSelectedReaderItem(item);
      setActiveTabState('leitor');
      window.scrollTo({ top: 0 });
    });
  }, []);

  // Authors CRUD
  const addAuthor = useCallback(
    (authorData: Omit<Author, 'id'>) => {
      setAuthors(prev => [{ ...authorData, id: `author-${Date.now()}` }, ...prev]);
    },
    [setAuthors]
  );

  const updateAuthor = useCallback(
    (id: string, updated: Partial<Author>) => {
      setAuthors(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
    },
    [setAuthors]
  );

  const deleteAuthor = useCallback(
    (id: string) => {
      setAuthors(prev => prev.filter(a => a.id !== id));
    },
    [setAuthors]
  );

  // Articles CRUD
  const addArticle = useCallback(
    (articleData: Omit<Article, 'id'>) => {
      setArticles(prev => [{ ...articleData, id: `art-${Date.now()}` }, ...prev]);
    },
    [setArticles]
  );

  const updateArticle = useCallback(
    (id: string, updated: Partial<Article>) => {
      setArticles(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
    },
    [setArticles]
  );

  const deleteArticle = useCallback(
    (id: string) => {
      setArticles(prev => prev.filter(a => a.id !== id));
    },
    [setArticles]
  );

  // Catalog CRUD
  const addCatalogItem = useCallback(
    (itemData: Omit<CatalogItem, 'id'>) => {
      setCatalog(prev => [{ ...itemData, id: `cat-${Date.now()}` }, ...prev]);
    },
    [setCatalog]
  );

  const updateCatalogItem = useCallback(
    (id: string, updated: Partial<CatalogItem>) => {
      setCatalog(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    },
    [setCatalog]
  );

  const deleteCatalogItem = useCallback(
    (id: string) => {
      setCatalog(prev => prev.filter(c => c.id !== id));
    },
    [setCatalog]
  );

  const updateStock = useCallback(
    (id: string, delta: number) => {
      setCatalog(prev =>
        prev.map(item =>
          item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
        )
      );
    },
    [setCatalog]
  );

  // Cart operations
  // O limite vem do estoque atual do catálogo, não da cópia guardada na
  // sacola. A decisão é tomada fora do updater do setState: o React pode
  // adiar (ou repetir) o updater, e o aviso sairia errado.
  const stockOf = useCallback(
    (item: CatalogItem) => catalog.find(c => c.id === item.id)?.stock ?? item.stock,
    [catalog]
  );

  const addToCart = useCallback(
    (item: CatalogItem) => {
      const stock = stockOf(item);
      const inCart = cart.find(i => i.item.id === item.id)?.quantity ?? 0;

      if (inCart >= stock) {
        notify(
          stock <= 0
            ? `"${item.title}" está esgotado no acervo.`
            : stock === 1
            ? `"${item.title}" é peça única: há apenas um exemplar no acervo.`
            : `Restam ${stock} exemplares de "${item.title}" no acervo.`,
          'error'
        );
        return;
      }

      setCart(prev =>
        prev.some(i => i.item.id === item.id)
          ? prev.map(i => (i.item.id === item.id ? { item, quantity: i.quantity + 1 } : i))
          : [...prev, { item, quantity: 1 }]
      );
      setIsCartOpen(true);
    },
    [cart, notify, setCart, stockOf]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart(prev => prev.filter(i => i.item.id !== itemId));
    },
    [setCart]
  );

  const updateCartQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart(prev => prev.filter(i => i.item.id !== itemId));
        return;
      }

      const entry = cart.find(i => i.item.id === itemId);
      if (!entry) return;
      const stock = stockOf(entry.item);
      const capped = Math.min(quantity, stock);

      if (capped <= 0) {
        setCart(prev => prev.filter(i => i.item.id !== itemId));
      } else {
        setCart(prev => prev.map(i => (i.item.id === itemId ? { ...i, quantity: capped } : i)));
      }

      if (quantity > stock) {
        const { title } = entry.item;
        notify(
          stock <= 0
            ? `"${title}" esgotou e saiu da sacola.`
            : stock === 1
            ? `"${title}" é peça única: mantivemos um exemplar na sacola.`
            : `Só há ${stock} exemplares de "${title}"; ajustamos a quantidade.`,
          'error'
        );
      }
    },
    [cart, notify, setCart, stockOf]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    setSelectedShipping(null);
  }, [setCart]);

  // Cart calculations
  const totals = useMemo(() => {
    const subscriberRate = SUBSCRIBER_RATES[currentUser.activePlan ?? ''] ?? 0;
    const hasFreeShipping = currentUser.activePlan === FREE_SHIPPING_PLAN;

    const rawSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    const subscriberDiscount = rawSubtotal * subscriberRate;
    const afterSubscriber = Math.max(0, rawSubtotal - subscriberDiscount);

    // O cupom é relido da lista atual: se o administrador o pausou, apagou
    // ou ele venceu depois de aplicado, deixa de descontar.
    const liveCoupon = appliedCoupon
      ? coupons.find(c => c.code === appliedCoupon.code) ?? null
      : null;
    const effectiveCoupon =
      liveCoupon && !couponProblem(liveCoupon, rawSubtotal) ? liveCoupon : null;
    const couponDiscount = effectiveCoupon
      ? (afterSubscriber * Math.min(100, effectiveCoupon.discountPercentage)) / 100
      : 0;
    const discountAmount = subscriberDiscount + couponDiscount;
    const shippingCost = hasFreeShipping ? 0 : selectedShipping?.price ?? 0;

    return {
      cartSubtotal: rawSubtotal,
      subscriberRate,
      subscriberDiscount,
      hasFreeShipping,
      shippingCost,
      effectiveCoupon,
      couponDiscount,
      discountAmount,
      cartTotal: Math.max(0, rawSubtotal - discountAmount) + shippingCost
    };
  }, [cart, currentUser.activePlan, appliedCoupon, coupons, selectedShipping]);

  const applyCoupon = useCallback(
    (code: string) => {
      const cleanCode = code.trim().toUpperCase();
      const found = coupons.find(c => c.code.toUpperCase() === cleanCode);
      if (!found) {
        return {
          success: false,
          message: `Não encontramos o cupom "${cleanCode}". Confira o código e tente de novo.`
        };
      }
      const problem = couponProblem(found, totals.cartSubtotal);
      if (problem) return { success: false, message: problem };
      setAppliedCoupon(found);
      return {
        success: true,
        message: `Cupom ${found.code} aplicado: ${found.discountPercentage}% de desconto nas obras.`
      };
    },
    [coupons, totals.cartSubtotal]
  );

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  // Simulação de frete dos Correios a partir do prefixo do CEP
  const calculateShipping = useCallback((cep: string): CorreiosQuote[] => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length < 8) return [];

    const isSP = cleaned.startsWith('0');
    const isSudeste = ['1', '2', '3'].some(p => cleaned.startsWith(p));

    return [
      {
        service: 'Mini Envios',
        name: 'Correios Mini Envios (Até 300g com rastreio)',
        price: isSP ? 14.5 : isSudeste ? 18.9 : 26.0,
        deadlineDays: isSP ? 3 : isSudeste ? 5 : 8
      },
      {
        service: 'PAC',
        name: 'Correios PAC Convencional',
        price: isSP ? 21.0 : isSudeste ? 27.5 : 38.0,
        deadlineDays: isSP ? 4 : isSudeste ? 6 : 10
      },
      {
        service: 'SEDEX',
        name: 'Correios SEDEX Expresso',
        price: isSP ? 31.0 : isSudeste ? 42.0 : 59.0,
        deadlineDays: isSP ? 1 : isSudeste ? 2 : 4
      }
    ];
  }, []);

  // Plans & Coupons
  const updatePlan = useCallback(
    (id: string, updated: Partial<SubscriptionPlan>) => {
      setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    },
    [setPlans]
  );

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      setCoupons(prev => [coupon, ...prev.filter(c => c.code !== coupon.code)]);
    },
    [setCoupons]
  );

  const toggleCoupon = useCallback(
    (code: string) => {
      setCoupons(prev => prev.map(c => (c.code === code ? { ...c, active: !c.active } : c)));
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      setCoupons(prev => prev.filter(c => c.code !== code));
    },
    [setCoupons]
  );

  // Orders
  const createOrder = useCallback(
    (data: { address: ShippingAddress; paymentMethod: 'pix' | 'credit_card' }): Order => {
      const orderItems = cart.map(c => ({
        id: c.item.id,
        title: c.item.title,
        price: c.item.price,
        quantity: c.quantity,
        coverImage: c.item.coverImage,
        condition: c.item.condition
      }));

      const randDigits = Math.floor(100000000 + Math.random() * 900000000);

      const newOrder: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        items: orderItems,
        subtotal: totals.cartSubtotal,
        discount: totals.discountAmount,
        couponCode: totals.effectiveCoupon?.code,
        // O frete gravado é o mesmo que entrou no total cobrado.
        shippingMethod: totals.hasFreeShipping ? 'SEDEX' : selectedShipping?.service ?? 'SEDEX',
        shippingPrice: totals.shippingCost,
        total: totals.cartTotal,
        shippingAddress: data.address,
        paymentGateway: 'infinitepay',
        paymentStatus: 'paid',
        paymentMethod: data.paymentMethod,
        trackingCode: `BR${randDigits}AA`,
        createdAt: new Date().toISOString()
      };

      cart.forEach(c => updateStock(c.item.id, -c.quantity));

      setCurrentUser(prev => ({
        ...prev,
        purchasedItems: [...new Set([...prev.purchasedItems, ...cart.map(c => c.item.id)])]
      }));

      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    },
    [cart, currentUser, totals, selectedShipping, updateStock, setCurrentUser, setOrders, clearCart]
  );

  const updateInfinitePayConfig = useCallback(
    (config: Partial<InfinitePayConfig>) => {
      setInfinitePayConfig(prev => ({ ...prev, ...config }));
    },
    [setInfinitePayConfig]
  );

  const startCartCheckout = useCallback(() => {
    setCheckoutType('cart');
    setCheckoutPlan(null);
    setIsInfinitePayModalOpen(true);
  }, []);

  const startSubscriptionCheckout = useCallback((plan: SubscriptionPlan, cycle: BillingCycle = 'monthly') => {
    setCheckoutType('subscription');
    setCheckoutPlan(plan);
    setCheckoutCycle(cycle);
    setIsInfinitePayModalOpen(true);
  }, []);

  const value = useMemo<StoreContextType>(
    () => ({
      activeTab,
      setActiveTab,
      selectedReaderItem,
      openReader,
      transitioningCoverId,
      setTransitioningCoverId,
      selectedAuthor,
      setSelectedAuthor,
      selectedArticle,
      setSelectedArticle,
      currentUser,
      setRole,
      subscribeUser,
      cancelSubscription,
      authors,
      addAuthor,
      updateAuthor,
      deleteAuthor,
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      catalog,
      addCatalogItem,
      updateCatalogItem,
      deleteCatalogItem,
      updateStock,
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal: totals.cartSubtotal,
      cartTotal: totals.cartTotal,
      discountAmount: totals.discountAmount,
      subscriberDiscount: totals.subscriberDiscount,
      subscriberRate: totals.subscriberRate,
      hasFreeShipping: totals.hasFreeShipping,
      shippingCost: totals.shippingCost,
      couponDiscount: totals.couponDiscount,
      appliedCoupon: totals.effectiveCoupon,
      applyCoupon,
      removeCoupon,
      selectedShipping,
      setSelectedShipping,
      calculateShipping,
      plans,
      updatePlan,
      coupons,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      orders,
      createOrder,
      infinitePayConfig,
      updateInfinitePayConfig,
      isInfinitePayModalOpen,
      setIsInfinitePayModalOpen,
      checkoutType,
      checkoutPlan,
      checkoutCycle,
      startCartCheckout,
      startSubscriptionCheckout
    }),
    [
      activeTab,
      setActiveTab,
      selectedReaderItem,
      openReader,
      transitioningCoverId,
      selectedAuthor,
      setSelectedAuthor,
      selectedArticle,
      setSelectedArticle,
      currentUser,
      setRole,
      subscribeUser,
      cancelSubscription,
      authors,
      addAuthor,
      updateAuthor,
      deleteAuthor,
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      catalog,
      addCatalogItem,
      updateCatalogItem,
      deleteCatalogItem,
      updateStock,
      cart,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      totals,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      selectedShipping,
      calculateShipping,
      plans,
      updatePlan,
      coupons,
      addCoupon,
      toggleCoupon,
      deleteCoupon,
      orders,
      createOrder,
      infinitePayConfig,
      updateInfinitePayConfig,
      isInfinitePayModalOpen,
      checkoutType,
      checkoutPlan,
      checkoutCycle,
      startCartCheckout,
      startSubscriptionCheckout
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
