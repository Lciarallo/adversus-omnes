import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface StoreContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedReaderItem: CatalogItem | null;
  openReader: (item: CatalogItem) => void;
  selectedAuthor: Author | null;
  setSelectedAuthor: (author: Author | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;

  // User & Auth
  currentUser: User;
  setRole: (role: UserRole) => void;
  subscribeUser: (planName: string) => void;
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
  createOrder: (data: {
    address: ShippingAddress;
    paymentMethod: 'pix' | 'credit_card';
    shippingMethod: string;
    shippingPrice: number;
  }) => Order;

  // InfinitePay
  infinitePayConfig: InfinitePayConfig;
  updateInfinitePayConfig: (config: Partial<InfinitePayConfig>) => void;
  isInfinitePayModalOpen: boolean;
  setIsInfinitePayModalOpen: (open: boolean) => void;
  checkoutType: 'cart' | 'subscription';
  checkoutPlan: SubscriptionPlan | null;
  startCartCheckout: () => void;
  startSubscriptionCheckout: (plan: SubscriptionPlan) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedReaderItem, setSelectedReaderItem] = useState<CatalogItem | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('contraste_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-default',
          name: 'Visitante da Biblioteca',
          email: 'leitor@bibliotecacontraste.com.br',
          role: 'visitor' as UserRole,
          purchasedItems: ['cat-1']
        };
  });

  // Data States with LocalStorage Cache
  const [authors, setAuthors] = useState<Author[]>(() => {
    const saved = localStorage.getItem('contraste_authors');
    return saved ? JSON.parse(saved) : INITIAL_AUTHORS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('contraste_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [catalog, setCatalog] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('contraste_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('contraste_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('contraste_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('contraste_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [infinitePayConfig, setInfinitePayConfig] = useState<InfinitePayConfig>(() => {
    const saved = localStorage.getItem('contraste_infinitepay');
    return saved ? JSON.parse(saved) : INITIAL_INFINITEPAY_CONFIG;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('contraste_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<CorreiosQuote | null>(null);

  // Checkout Modal State
  const [isInfinitePayModalOpen, setIsInfinitePayModalOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'cart' | 'subscription'>('cart');
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('contraste_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('contraste_authors', JSON.stringify(authors));
  }, [authors]);

  useEffect(() => {
    localStorage.setItem('contraste_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('contraste_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('contraste_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('contraste_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('contraste_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('contraste_infinitepay', JSON.stringify(infinitePayConfig));
  }, [infinitePayConfig]);

  useEffect(() => {
    localStorage.setItem('contraste_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth / Role switcher
  const setRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin-master',
        name: 'Administrador Contraste',
        email: 'diretoria@bibliotecacontraste.com.br',
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
      setCurrentUser({
        id: 'user-visitor',
        name: 'Visitante da Biblioteca',
        email: 'leitor@bibliotecacontraste.com.br',
        role: 'visitor',
        purchasedItems: []
      });
    }
  };

  const subscribeUser = (planName: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setCurrentUser(prev => ({
      ...prev,
      role: 'subscriber',
      activePlan: planName,
      subscriptionExpiresAt: nextYear.toISOString().split('T')[0]
    }));
  };

  const cancelSubscription = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: 'visitor',
      activePlan: undefined,
      subscriptionExpiresAt: undefined
    }));
  };

  // Open PDF Reader
  const openReader = (item: CatalogItem) => {
    setSelectedReaderItem(item);
    setActiveTab('leitor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authors CRUD
  const addAuthor = (authorData: Omit<Author, 'id'>) => {
    const newAuthor: Author = {
      ...authorData,
      id: `author-${Date.now()}`
    };
    setAuthors(prev => [newAuthor, ...prev]);
  };

  const updateAuthor = (id: string, updated: Partial<Author>) => {
    setAuthors(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAuthor = (id: string) => {
    setAuthors(prev => prev.filter(a => a.id !== id));
  };

  // Articles CRUD
  const addArticle = (articleData: Omit<Article, 'id'>) => {
    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}`
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setArticles(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // Catalog CRUD
  const addCatalogItem = (itemData: Omit<CatalogItem, 'id'>) => {
    const newItem: CatalogItem = {
      ...itemData,
      id: `cat-${Date.now()}`
    };
    setCatalog(prev => [newItem, ...prev]);
  };

  const updateCatalogItem = (id: string, updated: Partial<CatalogItem>) => {
    setCatalog(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCatalogItem = (id: string) => {
    setCatalog(prev => prev.filter(c => c.id !== id));
  };

  const updateStock = (id: string, delta: number) => {
    setCatalog(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // Cart operations
  const addToCart = (item: CatalogItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          alert(`Desculpe, o estoque disponível para este exemplar é de apenas ${item.stock} unidade(s).`);
          return prev;
        }
        return prev.map(i => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(i => {
        if (i.item.id === itemId) {
          if (quantity > i.item.stock) {
            alert(`Estoque máximo disponível: ${i.item.stock}`);
            return { ...i, quantity: i.item.stock };
          }
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setSelectedShipping(null);
  };

  // Cart calculations
  // Discount for subscribers (Pesquisador = 15%, Círculo = 20%)
  const subscriberDiscountRate =
    currentUser.activePlan === 'Membro do Círculo'
      ? 0.20
      : currentUser.activePlan === 'Pesquisador'
      ? 0.15
      : 0;

  const rawSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const subscriberDiscount = rawSubtotal * subscriberDiscountRate;
  const subtotalAfterSubscriberDiscount = Math.max(0, rawSubtotal - subscriberDiscount);

  const couponDiscount = appliedCoupon
    ? (subtotalAfterSubscriberDiscount * appliedCoupon.discountPercentage) / 100
    : 0;

  const discountAmount = subscriberDiscount + couponDiscount;
  const cartSubtotal = rawSubtotal;
  
  // Free shipping for Membro do Círculo
  const finalShippingPrice =
    currentUser.activePlan === 'Membro do Círculo'
      ? 0
      : selectedShipping
      ? selectedShipping.price
      : 0;

  const cartTotal = Math.max(0, rawSubtotal - discountAmount + finalShippingPrice);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso! Desconto de ${found.discountPercentage}%.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Correios Shipping Calculation Simulation
  const calculateShipping = (cep: string): CorreiosQuote[] => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length < 8) return [];

    // Realistic calculation based on prefix
    const isSP = cleaned.startsWith('0');
    const isSudeste = ['1', '2', '3'].some(p => cleaned.startsWith(p));

    return [
      {
        service: 'Mini Envios',
        name: 'Correios Mini Envios (Até 300g com rastreio)',
        price: isSP ? 14.50 : isSudeste ? 18.90 : 26.00,
        deadlineDays: isSP ? 3 : isSudeste ? 5 : 8
      },
      {
        service: 'PAC',
        name: 'Correios PAC Convencional',
        price: isSP ? 21.00 : isSudeste ? 27.50 : 38.00,
        deadlineDays: isSP ? 4 : isSudeste ? 6 : 10
      },
      {
        service: 'SEDEX',
        name: 'Correios SEDEX Expresso',
        price: isSP ? 31.00 : isSudeste ? 42.00 : 59.00,
        deadlineDays: isSP ? 1 : isSudeste ? 2 : 4
      }
    ];
  };

  // Plans & Coupons updates
  const updatePlan = (id: string, updated: Partial<SubscriptionPlan>) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev.filter(c => c.code !== coupon.code)]);
  };

  const toggleCoupon = (code: string) => {
    setCoupons(prev => prev.map(c => (c.code === code ? { ...c, active: !c.active } : c)));
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  // Orders creation
  const createOrder = (data: {
    address: ShippingAddress;
    paymentMethod: 'pix' | 'credit_card';
    shippingMethod: string;
    shippingPrice: number;
  }): Order => {
    const orderItems = cart.map(c => ({
      id: c.item.id,
      title: c.item.title,
      price: c.item.price,
      quantity: c.quantity,
      coverImage: c.item.coverImage,
      condition: c.item.condition
    }));

    // Generate random Correios tracking code
    const randDigits = Math.floor(100000000 + Math.random() * 900000000);
    const trackingCode = `BR${randDigits}AA`;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingMethod: data.shippingMethod,
      shippingPrice: data.shippingPrice,
      total: cartTotal,
      shippingAddress: data.address,
      paymentGateway: 'infinitepay',
      paymentStatus: 'paid',
      paymentMethod: data.paymentMethod,
      trackingCode,
      createdAt: new Date().toISOString()
    };

    // Deduct stock
    cart.forEach(c => {
      updateStock(c.item.id, -c.quantity);
    });

    // Add purchased item to user library
    setCurrentUser(prev => ({
      ...prev,
      purchasedItems: [...new Set([...prev.purchasedItems, ...cart.map(c => c.item.id)])]
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateInfinitePayConfig = (config: Partial<InfinitePayConfig>) => {
    setInfinitePayConfig(prev => ({ ...prev, ...config }));
  };

  const startCartCheckout = () => {
    setCheckoutType('cart');
    setCheckoutPlan(null);
    setIsInfinitePayModalOpen(true);
  };

  const startSubscriptionCheckout = (plan: SubscriptionPlan) => {
    setCheckoutType('subscription');
    setCheckoutPlan(plan);
    setIsInfinitePayModalOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedReaderItem,
        openReader,
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
        cartSubtotal,
        cartTotal,
        discountAmount,
        appliedCoupon,
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
        startCartCheckout,
        startSubscriptionCheckout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
