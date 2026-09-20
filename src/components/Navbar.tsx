import React, { useRef, useState } from 'react';
import {
  CheckCircle,
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  Sliders,
  User,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useDismissable } from '../hooks/useDismissable';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  subscriber: 'Assinante',
  visitor: 'Visitante'
};

const NAV_ITEMS = [
  { id: 'home', label: 'Início' },
  { id: 'fisico', label: 'Acervo físico' },
  { id: 'digital', label: 'Acervo online' },
  { id: 'autores', label: 'Autores' },
  { id: 'artigos', label: 'Ensaios' },
  { id: 'planos', label: 'Assinaturas' }
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, cart, setIsCartOpen, currentUser, setRole } = useStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement | null>(null);
  const roleTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);

  useDismissable(roleMenuOpen, () => setRoleMenuOpen(false), roleMenuRef, roleTriggerRef);
  useDismissable(mobileMenuOpen, () => setMobileMenuOpen(false), mobileMenuRef, mobileTriggerRef);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const roleLabel = ROLE_LABEL[currentUser.role] ?? 'Visitante';

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseRole = (role: 'visitor' | 'subscriber' | 'admin') => {
    setRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <header className="museum-navigation">
      <aside className="museum-sidebar" aria-label="Navegação principal">
        <button type="button" onClick={() => handleNav('home')} className="museum-sidebar__brand">
          <img src="/logo-v2-light.png" alt="" width={104} height={104} />
          <strong>Adversus<br />Omnes</strong>
          <span>Livros, documentos<br />e ideias em perspectiva.</span>
        </button>

        <nav className="museum-sidebar__links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('admin')}
              aria-current={activeTab === 'admin' ? 'page' : undefined}
            >
              Administração
            </button>
          )}
        </nav>

        <div className="museum-sidebar__foot">
          <div className="museum-role">
            <button
              ref={roleTriggerRef}
              type="button"
              onClick={() => setRoleMenuOpen(open => !open)}
              aria-haspopup="menu"
              aria-expanded={roleMenuOpen}
              className="museum-role__trigger"
            >
              <span>Perfil de demonstração</span>
              <strong>{roleLabel}</strong>
              <ChevronDown size={14} aria-hidden="true" />
            </button>

            {roleMenuOpen && (
              <div ref={roleMenuRef} role="menu" className="museum-role__menu">
                {([
                  ['visitor', 'Visitante'],
                  ['subscriber', 'Assinante'],
                  ['admin', 'Administrador']
                ] as const).map(([role, label]) => (
                  <button key={role} type="button" role="menuitem" onClick={() => chooseRole(role)}>
                    <span>{label}</span>
                    {currentUser.role === role && <CheckCircle size={14} aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p>Bibliotheca<br />et Archivum</p>
        </div>
      </aside>

      <div className="museum-utility" aria-label="Ações rápidas">
        <button type="button" onClick={() => handleNav('digital')} className="museum-utility__search">
          <Search size={16} aria-hidden="true" />
          <span>Buscar no acervo…</span>
        </button>
        <button type="button" onClick={() => handleNav('minha-conta')} aria-label="Abrir minha conta">
          <User size={17} aria-hidden="true" />
          <span>Minha Conta</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Abrir sacola com ${totalCartCount} item(ns)`}
          className="museum-utility__cart"
        >
          <ShoppingBag size={17} aria-hidden="true" />
          {totalCartCount > 0 && <span>{totalCartCount}</span>}
        </button>
      </div>

      <div className="museum-mobilebar">
        <button type="button" onClick={() => handleNav('home')} className="museum-mobilebar__brand">
          <img src="/logo-v2.png" alt="" />
          <span>Adversus Omnes</span>
        </button>
        <div>
          <button type="button" onClick={() => handleNav('minha-conta')} aria-label="Minha conta">
            <User size={19} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setIsCartOpen(true)} aria-label={`Sacola com ${totalCartCount} item(ns)`}>
            <ShoppingBag size={19} aria-hidden="true" />
            {totalCartCount > 0 && <span>{totalCartCount}</span>}
          </button>
          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(open => !open)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav ref={mobileMenuRef} className="museum-mobilemenu" aria-label="Navegação móvel">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          <div className="museum-mobilemenu__roles">
            <span>Perfil</span>
            {(['visitor', 'subscriber', 'admin'] as const).map(role => (
              <button key={role} type="button" onClick={() => chooseRole(role)} aria-pressed={currentUser.role === role}>
                {ROLE_LABEL[role]}
              </button>
            ))}
          </div>
          {currentUser.role === 'admin' && (
            <button type="button" onClick={() => handleNav('admin')} className="museum-mobilemenu__admin">
              <Sliders size={15} aria-hidden="true" /> Administração
            </button>
          )}
        </nav>
      )}
    </header>
  );
};
