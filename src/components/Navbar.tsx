import React, { useState } from 'react';
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
import { UserRole } from '../types';

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

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121316]/95 backdrop-blur-md border-b border-[#282b38] transition-all">
      {/* Top micro-bar with Role Switcher Demo notice */}
      <div className="bg-[#161820] border-b border-[#222530] text-xs py-1 px-3 sm:px-8 flex items-center justify-between min-h-[44px] max-w-full overflow-hidden">
        <div className="flex items-center gap-2 text-stone-400 min-w-0 overflow-hidden">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          <span className="truncate">Ambiente de Testes</span>
          <span className="text-stone-600 hidden md:inline">|</span>
          <span className="text-[#c89b3c] font-medium font-cinzel truncate hidden md:inline">Edição de Colecionador & Acervo Crítico</span>
        </div>

        {/* Interactive Role Switcher for instant testing */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            aria-haspopup="true"
            aria-expanded={roleMenuOpen}
            aria-label={`Perfil de teste atual: ${currentUser.role}. Clique para alternar.`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded bg-[#20232d] hover:bg-[#2a2e3b] border border-[#343948] text-stone-200 transition text-xs min-h-[44px] whitespace-nowrap shrink-0 ml-2"
          >
            <span className="text-stone-400">Perfil:</span>
            <span className="font-semibold text-[#c89b3c] capitalize">
              {currentUser.role === 'admin'
                ? 'Admin'
                : currentUser.role === 'subscriber'
                ? `Assinante`
                : 'Visitante'}
            </span>
            <ChevronDown size={14} className="text-stone-400 shrink-0" aria-hidden="true" />
          </button>

          {roleMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-64 max-w-[calc(100vw-1.5rem)] bg-[#181a22] border border-[#323646] rounded-lg shadow-2xl py-1.5 z-50 text-xs"
            >
              <div className="px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-stone-400 border-b border-[#242735]">
                Simular Perfil de Acesso:
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('visitor');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-[#222532] flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'visitor' ? 'text-[#c89b3c] font-semibold bg-[#1f222e]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium">Visitante / Público</div>
                  <div className="text-xs text-stone-400">Visualiza loja física e PDFs livres</div>
                </div>
                {currentUser.role === 'visitor' && <CheckCircle size={14} className="text-[#c89b3c]" />}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('subscriber');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-[#222532] flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'subscriber' ? 'text-[#c89b3c] font-semibold bg-[#1f222e]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium">Cliente Assinante (Pesquisador)</div>
                  <div className="text-xs text-stone-400">Acesso ao leitor protegido + 15% off</div>
                </div>
                {currentUser.role === 'subscriber' && <CheckCircle size={14} className="text-[#c89b3c]" />}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setRole('admin');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-[#222532] flex items-center justify-between min-h-[44px] ${
                  currentUser.role === 'admin' ? 'text-[#c89b3c] font-semibold bg-[#1f222e]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium text-amber-300">Administrador do Site</div>
                  <div className="text-xs text-stone-400">CRUD de Autores, Artigos, Estoque & InfinitePay</div>
                </div>
                {currentUser.role === 'admin' && <CheckCircle size={14} className="text-[#c89b3c]" />}
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
            aria-label="Contra Homines - Ir para a página inicial"
            className="flex items-center gap-2 sm:gap-3 text-left group select-none min-h-[44px] min-w-0 shrink"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-sm bg-gradient-to-br from-[#c89b3c] to-[#966f21] p-[1px] shadow-lg shadow-[#c89b3c]/10 overflow-hidden shrink-0">
              <div className="w-full h-full bg-[#121316] flex items-center justify-center group-hover:opacity-90 transition">
                <img
                  src="/logo.jpg"
                  alt="Contra Homines"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-cinzel text-sm sm:text-xl font-bold tracking-wide sm:tracking-wider text-stone-100 group-hover:text-[#c89b3c] transition truncate">
                CONTRA HOMINES
              </div>
              {/* A assinatura não cabe ao lado dos controles no celular: era cortada
                  pela borda inferior do cabeçalho. */}
              <div className="hidden sm:block font-serif text-xs text-stone-400 italic tracking-wide">
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
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              Início
            </button>

            <button
              type="button"
              onClick={() => handleNav('fisico')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'fisico'
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              <BookMarked size={16} className="text-[#c89b3c]" aria-hidden="true" />
              <span>Acervo Físico</span>
              <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/50 px-1.5 py-0.2 rounded font-mono">
                Raros
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('digital')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'digital'
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              <Scroll size={16} className="text-[#c89b3c]" aria-hidden="true" />
              <span>Acervo Online</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('autores')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium min-h-[44px] flex items-center ${
                activeTab === 'autores'
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              Autores
            </button>

            <button
              type="button"
              onClick={() => handleNav('artigos')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium min-h-[44px] flex items-center ${
                activeTab === 'artigos'
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              Artigos & Ensaios
            </button>

            <button
              type="button"
              onClick={() => handleNav('planos')}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium flex items-center gap-1.5 min-h-[44px] ${
                activeTab === 'planos'
                  ? 'text-[#c89b3c] bg-[#1d2028]'
                  : 'text-stone-300 hover:text-white hover:bg-[#171922]'
              }`}
            >
              <Sparkles size={15} className="text-[#c89b3c]" aria-hidden="true" />
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
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
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
                className="hidden lg:flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 px-2.5 py-2 rounded-lg transition min-h-[44px]"
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
              className={`p-2 sm:p-2.5 rounded-lg border transition flex items-center gap-2 min-h-[44px] min-w-[40px] sm:min-w-[44px] justify-center ${
                activeTab === 'minha-conta'
                  ? 'border-[#c89b3c] text-[#c89b3c] bg-[#22242e]'
                  : 'border-[#2d303b] text-stone-300 hover:text-white hover:bg-[#1b1e26]'
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
              className="relative p-2 sm:p-2.5 rounded-lg border border-[#353945] bg-[#181a22] hover:border-[#c89b3c] text-stone-200 transition min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center group"
            >
              <ShoppingBag size={18} className="group-hover:text-[#c89b3c] transition" aria-hidden="true" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c89b3c] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 scale-100">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 sm:p-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-[#1d2028] min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegação móvel"
          className="md:hidden bg-[#15171d] border-b border-[#2e323e] px-4 pt-2 pb-6 space-y-2"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] min-h-[44px] flex items-center"
          >
            Início
          </button>
          <button
            type="button"
            onClick={() => handleNav('fisico')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] flex items-center justify-between min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <BookMarked size={16} className="text-[#c89b3c]" aria-hidden="true" /> Acervo Físico (Raros & Usados)
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('digital')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2 min-h-[44px]"
          >
            <Scroll size={16} className="text-[#c89b3c]" aria-hidden="true" /> Acervo Digital & Documentos
          </button>
          <button
            type="button"
            onClick={() => handleNav('autores')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] min-h-[44px] flex items-center"
          >
            Autores & Biografias
          </button>
          <button
            type="button"
            onClick={() => handleNav('artigos')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] min-h-[44px] flex items-center"
          >
            Artigos Autorais & Blog
          </button>
          <button
            type="button"
            onClick={() => handleNav('planos')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2 min-h-[44px]"
          >
            <Sparkles size={16} className="text-[#c89b3c]" aria-hidden="true" /> Planos de Assinatura
          </button>
          <button
            type="button"
            onClick={() => handleNav('minha-conta')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2 min-h-[44px]"
          >
            <User size={16} className="text-[#c89b3c]" aria-hidden="true" /> Minha Conta / Assinante
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className="w-full text-left py-3 px-3 rounded-lg text-sm text-amber-300 font-semibold hover:bg-[#20232c] flex items-center gap-2 min-h-[44px]"
          >
            <Shield size={16} aria-hidden="true" /> Painel Administrativo
          </button>
        </nav>
      )}
    </header>
  );
};
