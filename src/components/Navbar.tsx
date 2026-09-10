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
  LogOut,
  Sliders,
  CheckCircle,
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
    <header className="sticky top-0 z-40 bg-[#121316]/95 backdrop-blur border-b border-[#2a2d36] transition-all">
      {/* Top micro-bar with Role Switcher Demo notice */}
      <div className="bg-[#181a20] border-b border-[#252830] text-xs py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Ambiente de Testes Ativo</span>
          <span className="text-stone-600">|</span>
          <span className="text-[#c89b3c] font-medium font-cinzel">Edição de Colecionador & Acervo Crítico</span>
        </div>

        {/* Interactive Role Switcher for instant testing */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#232630] hover:bg-[#2e323e] border border-[#383c4a] text-stone-200 transition text-[11px]"
            title="Alternar perfil para testar permissões de assinante e administrador"
          >
            <span className="text-stone-400">Perfil de Teste:</span>
            <span className="font-semibold text-[#c89b3c] capitalize">
              {currentUser.role === 'admin'
                ? 'Administrador Geral'
                : currentUser.role === 'subscriber'
                ? `Assinante (${currentUser.activePlan || 'Ativo'})`
                : 'Visitante Comum'}
            </span>
            <ChevronDown size={13} className="text-stone-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-[#1a1c23] border border-[#353945] rounded shadow-2xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-stone-500 border-b border-[#2a2d36]">
                Simular Perfil de Acesso:
              </div>
              <button
                onClick={() => {
                  setRole('visitor');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-[#242732] flex items-center justify-between ${
                  currentUser.role === 'visitor' ? 'text-[#c89b3c] font-semibold bg-[#212430]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium">Visitante / Público</div>
                  <div className="text-[10px] text-stone-400">Visualiza loja física e PDFs livres</div>
                </div>
                {currentUser.role === 'visitor' && <CheckCircle size={14} />}
              </button>

              <button
                onClick={() => {
                  setRole('subscriber');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-[#242732] flex items-center justify-between ${
                  currentUser.role === 'subscriber' ? 'text-[#c89b3c] font-semibold bg-[#212430]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium">Cliente Assinante (Pesquisador)</div>
                  <div className="text-[10px] text-stone-400">Acesso ao leitor protegido + 15% off</div>
                </div>
                {currentUser.role === 'subscriber' && <CheckCircle size={14} />}
              </button>

              <button
                onClick={() => {
                  setRole('admin');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-[#242732] flex items-center justify-between ${
                  currentUser.role === 'admin' ? 'text-[#c89b3c] font-semibold bg-[#212430]' : 'text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium text-amber-300">Administrador do Site</div>
                  <div className="text-[10px] text-stone-400">CRUD de Autores, Artigos, Estoque & InfinitePay</div>
                </div>
                {currentUser.role === 'admin' && <CheckCircle size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-[#c89b3c] to-[#966f21] p-[1px] shadow-lg shadow-[#c89b3c]/10">
              <div className="w-full h-full bg-[#121316] flex items-center justify-center group-hover:bg-[#1a1c22] transition">
                <BookOpen className="text-[#c89b3c] w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
            </div>
            <div>
              <div className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-stone-100 group-hover:text-[#c89b3c] transition">
                BIBLIOTECA CONTRASTE
              </div>
              <div className="font-serif text-xs text-stone-400 italic tracking-wide">
                Livros, documentos e ideias em perspectiva
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded text-sm transition font-medium ${
                activeTab === 'home'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => handleNav('fisico')}
              className={`px-3 py-2 rounded text-sm transition font-medium flex items-center gap-1.5 ${
                activeTab === 'fisico'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              <BookMarked size={16} className="text-[#c89b3c]" />
              <span>Acervo Físico</span>
              <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/50 px-1.5 py-0.2 rounded font-mono">
                Raros
              </span>
            </button>

            <button
              onClick={() => handleNav('digital')}
              className={`px-3 py-2 rounded text-sm transition font-medium flex items-center gap-1.5 ${
                activeTab === 'digital'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              <Scroll size={16} className="text-[#c89b3c]" />
              <span>Acervo Online</span>
            </button>

            <button
              onClick={() => handleNav('autores')}
              className={`px-3 py-2 rounded text-sm transition font-medium ${
                activeTab === 'autores'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              Autores
            </button>

            <button
              onClick={() => handleNav('artigos')}
              className={`px-3 py-2 rounded text-sm transition font-medium ${
                activeTab === 'artigos'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              Artigos & Ensaios
            </button>

            <button
              onClick={() => handleNav('planos')}
              className={`px-3 py-2 rounded text-sm transition font-medium flex items-center gap-1.5 ${
                activeTab === 'planos'
                  ? 'text-[#c89b3c] bg-[#1d2027]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181a21]'
              }`}
            >
              <Sparkles size={15} className="text-[#c89b3c]" />
              <span>Assinaturas</span>
            </button>
          </nav>

          {/* Action Icons (Cart, Account, Admin Dashboard) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard button */}
            {currentUser.role === 'admin' ? (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider border transition ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                }`}
              >
                <Shield size={14} />
                <span className="hidden sm:inline">Painel Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('admin')}
                className="hidden lg:flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 px-2 py-1 rounded transition"
                title="Acessar painel administrativo"
              >
                <Sliders size={13} />
                <span>Admin</span>
              </button>
            )}

            {/* Customer Portal (Minha Conta) */}
            <button
              onClick={() => handleNav('minha-conta')}
              className={`p-2 rounded-lg border transition flex items-center gap-2 ${
                activeTab === 'minha-conta'
                  ? 'border-[#c89b3c] text-[#c89b3c] bg-[#22242e]'
                  : 'border-[#2d303b] text-stone-300 hover:text-white hover:bg-[#1b1e26]'
              }`}
              title="Área do Leitor / Minha Conta"
            >
              <User size={19} />
              <span className="hidden xl:inline text-xs font-medium">
                {currentUser.role === 'subscriber' ? 'Portal do Assinante' : 'Minha Conta'}
              </span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg border border-[#353945] bg-[#1a1c23] hover:border-[#c89b3c] text-stone-200 transition group"
              title="Sacola de Livros Físicos"
            >
              <ShoppingBag size={20} className="group-hover:text-[#c89b3c] transition" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c89b3c] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-[#1d2028]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#15171d] border-b border-[#2e323e] px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c]"
          >
            Início
          </button>
          <button
            onClick={() => handleNav('fisico')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <BookMarked size={16} className="text-[#c89b3c]" /> Acervo Físico (Raros & Usados)
            </span>
          </button>
          <button
            onClick={() => handleNav('digital')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2"
          >
            <Scroll size={16} className="text-[#c89b3c]" /> Acervo Digital & Documentos
          </button>
          <button
            onClick={() => handleNav('autores')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c]"
          >
            Autores & Biografias
          </button>
          <button
            onClick={() => handleNav('artigos')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c]"
          >
            Artigos Autorais & Blog
          </button>
          <button
            onClick={() => handleNav('planos')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2"
          >
            <Sparkles size={16} className="text-[#c89b3c]" /> Planos de Assinatura
          </button>
          <button
            onClick={() => handleNav('minha-conta')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-stone-200 hover:bg-[#20232c] flex items-center gap-2"
          >
            <User size={16} className="text-[#c89b3c]" /> Minha Conta / Assinante
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="w-full text-left py-2.5 px-3 rounded text-sm text-amber-300 font-semibold hover:bg-[#20232c] flex items-center gap-2"
          >
            <Shield size={16} /> Painel Administrativo
          </button>
        </div>
      )}
    </header>
  );
};
