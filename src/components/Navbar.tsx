import React, { useRef, useState } from 'react';
import {
  BookOpen,
  ShoppingBag,
  User,
  Shield,
  BookMarked,
  Scroll,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Sliders,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useDismissable } from '../hooks/useDismissable';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  subscriber: 'Assinante',
  visitor: 'Visitante'
};

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cart,
    setIsCartOpen,
    currentUser,
    setRole
  } = useStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement | null>(null);
  const roleTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Um menu aberto fecha com Escape e com um clique fora dele.
  useDismissable(roleMenuOpen, () => setRoleMenuOpen(false), roleMenuRef, roleTriggerRef);
  useDismissable(mobileMenuOpen, () => setMobileMenuOpen(false), mobileMenuRef, mobileTriggerRef);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const roleLabel = ROLE_LABEL[currentUser.role] ?? 'Visitante';

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-paper-600/95 backdrop-blur-md border-b border-rule transition-all">
      {/* Top micro-bar with Role Switcher Demo notice */}
      <div className="bg-paper-700 border-b border-rule-faint text-xs py-1 px-3 sm:px-8 flex items-center justify-between min-h-[44px] max-w-full overflow-hidden">
        <div className="flex items-center gap-2 text-ink-soft min-w-0 overflow-hidden">
          <span className="inline-block w-2 h-2 rounded-full bg-verdete shrink-0" aria-hidden="true" />
          <span className="truncate">Ambiente de Testes</span>
          <span className="text-ink-faint hidden md:inline">|</span>
          <span className="text-rubrica font-medium font-cinzel truncate hidden md:inline">Edição de Colecionador & Acervo Crítico</span>
        </div>

        {/* Interactive Role Switcher for instant testing */}
        <div className="relative shrink-0">
          <button
            ref={roleTriggerRef}
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            aria-haspopup="menu"
            aria-expanded={roleMenuOpen}
            aria-label={`Perfil de demonstração: ${roleLabel}. Alternar perfil.`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded bg-paper-600 hover:bg-paper-300 border border-rule-strong text-ink transition text-xs min-h-[44px] whitespace-nowrap shrink-0 ml-2"
          >
            <span className="text-ink-soft">Perfil:</span>
            <span className="font-semibold text-rubrica">{roleLabel}</span>
            <ChevronDown size={14} className="text-ink-soft shrink-0" aria-hidden="true" />
          </button>

          {roleMenuOpen && (
            <div
              ref={roleMenuRef}
              role="menu"
              className="absolute right-0 mt-1 w-64 max-w-[calc(100vw-1.5rem)] bg-paper-700 border border-rule rounded-lg shadow-2xl py-1.5 z-50 text-xs"
            >
              <div className="px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-ink-soft border-b border-rule-faint">
                Simular Perfil de Acesso:
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('visitor');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-paper-400 flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'visitor' ? 'text-rubrica font-semibold bg-paper-600' : 'text-ink-soft'
                }`}
              >
                <div>
                  <div className="font-medium">Visitante / Público</div>
                  <div className="text-xs text-ink-soft">Visualiza loja física e PDFs livres</div>
                </div>
                {currentUser.role === 'visitor' && <CheckCircle size={14} className="text-rubrica" />}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('subscriber');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-paper-400 flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'subscriber' ? 'text-rubrica font-semibold bg-paper-600' : 'text-ink-soft'
                }`}
              >
                <div>
                  <div className="font-medium">Cliente Assinante (Pesquisador)</div>
                  <div className="text-xs text-ink-soft">Acesso ao leitor protegido + 15% off</div>
                </div>
                {currentUser.role === 'subscriber' && <CheckCircle size={14} className="text-rubrica" />}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('admin');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-paper-400 flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'admin' ? 'text-rubrica font-semibold bg-paper-600' : 'text-ink-soft'
                }`}
              >
                <div>
                  <div className="font-medium text-ocre">Administrador do Site</div>
                  <div className="text-xs text-ink-soft">CRUD de Autores, Artigos, Estoque & InfinitePay</div>
                </div>
                {currentUser.role === 'admin' && <CheckCircle size={14} className="text-rubrica" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo as semantic button */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            aria-label="Adversus Omnes - Ir para a página inicial"
            className="flex items-center gap-2 sm:gap-3 text-left group select-none min-h-[44px] min-w-0 shrink"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-sm border border-rule-strong bg-paper-800 p-[2px] overflow-hidden shrink-0">
              <div className="w-full h-full bg-paper-700 flex items-center justify-center group-hover:opacity-90 transition">
                <img
                  src="/logo.jpg"
                  alt="Adversus Omnes"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-cinzel text-sm sm:text-lg lg:text-xl font-bold tracking-wide text-ink group-hover:text-rubrica transition whitespace-nowrap">
                ADVERSUS OMNES
              </div>
              {/* A assinatura não cabe ao lado dos controles no celular: era cortada
                  pela borda inferior do cabeçalho. */}
              <div className="hidden xl:block font-serif text-xs text-ink-soft italic tracking-wide whitespace-nowrap">
                Livros, documentos e ideias em perspectiva
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium min-h-[44px] flex items-center ${
                activeTab === 'home'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              Início
            </button>

            <button
              type="button"
              onClick={() => handleNav('fisico')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'fisico'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              <BookMarked size={16} className="text-rubrica" aria-hidden="true" />
              <span>Acervo Físico</span>
              <span className="text-[10px] bg-ocre-tint/80 text-ocre border border-ocre/35 px-1.5 py-0.5 rounded font-mono">
                Raros
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('digital')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'digital'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              <Scroll size={16} className="text-rubrica" aria-hidden="true" />
              <span>Acervo Online</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('autores')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium min-h-[44px] flex items-center ${
                activeTab === 'autores'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              Autores
            </button>

            <button
              type="button"
              onClick={() => handleNav('artigos')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium min-h-[44px] flex items-center ${
                activeTab === 'artigos'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              Artigos & Ensaios
            </button>

            <button
              type="button"
              onClick={() => handleNav('planos')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'planos'
                  ? 'text-rubrica bg-paper-600'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-700'
              }`}
            >
              <Sparkles size={15} className="text-rubrica" aria-hidden="true" />
              <span>Assinaturas</span>
            </button>
          </nav>

          {/* Action Icons (Cart, Account, Admin Dashboard) */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
            {/* Admin Dashboard button */}
            {currentUser.role === 'admin' ? (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                aria-label="Acessar Painel do Administrador"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition min-h-[44px] ${
                  activeTab === 'admin'
                    ? 'bg-ocre text-paper-800 border-ocre'
                    : 'bg-ocre/10 text-ocre border-ocre/50 hover:bg-ocre/20'
                }`}
              >
                <Shield size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Painel Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                aria-label="Acessar painel administrativo"
                className="hidden lg:flex items-center gap-1 text-xs text-ink-soft hover:text-ink px-2.5 py-2 rounded-lg transition min-h-[44px]"
              >
                <Sliders size={13} aria-hidden="true" />
                <span>Admin</span>
              </button>
            )}

            {/* Customer Portal (Minha Conta) */}
            <button
              type="button"
              onClick={() => handleNav('minha-conta')}
              aria-label={currentUser.role === 'subscriber' ? 'Portal do Assinante' : 'Minha Conta'}
              className={`p-2 sm:p-2.5 rounded-lg border transition flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center ${
                activeTab === 'minha-conta'
                  ? 'border-rubrica text-rubrica bg-paper-400'
                  : 'border-rule text-ink-soft hover:text-ink hover:bg-paper-600'
              }`}
            >
              <User size={18} aria-hidden="true" />
              <span className="hidden xl:inline text-xs font-medium">
                {currentUser.role === 'subscriber' ? 'Portal do Assinante' : 'Minha Conta'}
              </span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir sacola de compras com ${totalCartCount} item(ns)`}
              className="relative p-2 sm:p-2.5 rounded-lg border border-rule-strong bg-paper-700 hover:border-rubrica text-ink transition min-h-[44px] min-w-[44px] flex items-center justify-center group"
            >
              <ShoppingBag size={18} className="group-hover:text-rubrica transition" aria-hidden="true" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rubrica text-paper-800 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 scale-100">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              ref={mobileTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 sm:p-2.5 rounded-lg text-ink-soft hover:text-ink hover:bg-paper-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          aria-label="Navegação móvel"
          className="md:hidden bg-paper-700 border-b border-rule px-4 pt-2 pb-6 space-y-2"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 min-h-[44px] flex items-center"
          >
            Início
          </button>
          <button
            type="button"
            onClick={() => handleNav('fisico')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 flex items-center justify-between min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <BookMarked size={16} className="text-rubrica" aria-hidden="true" /> Acervo Físico (Raros & Usados)
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('digital')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 flex items-center gap-2 min-h-[44px]"
          >
            <Scroll size={16} className="text-rubrica" aria-hidden="true" /> Acervo Digital & Documentos
          </button>
          <button
            type="button"
            onClick={() => handleNav('autores')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 min-h-[44px] flex items-center"
          >
            Autores & Biografias
          </button>
          <button
            type="button"
            onClick={() => handleNav('artigos')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 min-h-[44px] flex items-center"
          >
            Artigos Autorais & Blog
          </button>
          <button
            type="button"
            onClick={() => handleNav('planos')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 flex items-center gap-2 min-h-[44px]"
          >
            <Sparkles size={16} className="text-rubrica" aria-hidden="true" /> Planos de Assinatura
          </button>
          <button
            type="button"
            onClick={() => handleNav('minha-conta')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ink hover:bg-paper-600 flex items-center gap-2 min-h-[44px]"
          >
            <User size={16} className="text-rubrica" aria-hidden="true" /> Minha Conta / Assinante
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-ocre font-semibold hover:bg-paper-600 flex items-center gap-2 min-h-[44px]"
          >
            <Shield size={16} aria-hidden="true" /> Painel Administrativo
          </button>
        </nav>
      )}
    </header>
  );
};
