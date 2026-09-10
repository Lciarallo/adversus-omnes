export type UserRole = 'admin' | 'subscriber' | 'visitor';

export interface Author {
  id: string;
  name: string;
  pseudonym?: string;
  avatar: string;
  bio: string;
  birthYear?: number | string;
  deathYear?: number | string;
  period: string; // Ex: Século XIX, Iluminismo, Século XX
  politicalMovement: string; // Ex: Liberalismo Clássico, Marxismo, Anarquismo, Republicanismo
  themes: string[];
  works: string[];
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  authorId?: string;
  authorName: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  coverImage: string;
  content: string;
  status: 'published' | 'draft';
  historicalPeriod: string;
  politicalMovement?: string;
}

export type CatalogType = 'physical' | 'digital' | 'historical_doc';
export type AccessType = 'free' | 'exclusive' | 'sale';

export interface CatalogItem {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  year: number;
  type: CatalogType;
  access: AccessType;
  price: number; // 0 se for livre ou incluso na assinatura
  stock: number; // Estoque físico ou limite
  condition?: 'Raro / Peça Única' | 'Esgotado / 1ª Edição' | 'Usado - Excelente' | 'Usado - Bom' | 'Fac-símile Histórico';
  coverImage: string;
  description: string;
  pages: number;
  publisher?: string;
  dimensions?: string;
  politicalMovement: string;
  period: string;
  event?: string;
  pdfPages?: { pageNumber: number; title: string; content: string }[];
  downloadUrl?: string;
  isFeatured?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  activePlan?: string;
  subscriptionExpiresAt?: string;
  purchasedItems: string[];
}

export interface CartItem {
  item: CatalogItem;
  quantity: number;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    coverImage: string;
    condition?: string;
  }[];
  total: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingMethod: string;
  shippingPrice: number;
  shippingAddress: ShippingAddress;
  paymentGateway: 'infinitepay';
  paymentStatus: 'paid' | 'pending' | 'processing';
  paymentMethod: 'pix' | 'credit_card';
  trackingCode: string; // Ex: BR948201490AA
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  validUntil: string;
  minAmount?: number;
  active: boolean;
}

export interface CorreiosQuote {
  service: 'SEDEX' | 'PAC' | 'Mini Envios';
  name: string;
  price: number;
  deadlineDays: number;
}

export interface InfinitePayConfig {
  merchantId: string;
  apiKey: string;
  clientSecret: string;
  walletId: string;
  mode: 'sandbox' | 'production';
  webhookUrl: string;
  enabled: boolean;
}
