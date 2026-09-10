import React from 'react';
import { BookOpen, ShieldCheck, Truck, CreditCard, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <footer className="bg-[#0e0f12] border-t border-[#252832] text-stone-400 text-sm">
      {/* Editorial Trust Banner */}
      <div className="border-b border-[#1f222b] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-[#14161c] border border-[#232630]">
            <ShieldCheck className="text-[#c89b3c] w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Autenticidade Histórica Rigorosa</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Todas as primeiras edições e manuscritos raros passam por minuciosa curadoria, catalogação arquivística e testes de procedência.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-[#14161c] border border-[#232630]">
            <Truck className="text-[#c89b3c] w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Envio Especializado via Correios</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Embalagem hermética, camadas de proteção de papel neutro e plástico bolha reforçado. Envios rastreados por SEDEX e PAC para todo o território nacional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-[#14161c] border border-[#232630]">
            <CreditCard className="text-[#c89b3c] w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Pagamentos com InfinitePay</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Segurança criptográfica de ponta a ponta. Pagamentos instantâneos via Pix dinâmico e Cartão de Crédito com conciliação automática.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#c89b3c] w-5 h-5" />
            <span className="font-cinzel font-bold text-white tracking-wider text-base">
              BIBLIOTECA CONTRASTE
            </span>
          </div>
          <p className="text-xs leading-relaxed text-stone-400 font-serif italic">
            "Livros, documentos e ideias em perspectiva."
          </p>
          <p className="text-xs leading-relaxed text-stone-500">
            Uma ponte viva entre o acervo físico de obras raras, a documentação histórica esquecida e a produção de ensaios contemporâneos sobre economia, política e filosofia.
          </p>
        </div>

        {/* Acervo & Catálogo */}
        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#c89b3c] pl-2">
            Explorar Acervo
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveTab('fisico'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Livros Raros & Primeiras Edições
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('fisico'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Livros Usados & Esgotados
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('digital'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Documentos Históricos Livres (PDF)
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('digital'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Acervo Restrito de Assinantes
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('autores'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Índice de Autores & Filósofos
              </button>
            </li>
          </ul>
        </div>

        {/* Editorial & Assinaturas */}
        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#c89b3c] pl-2">
            Editorial & Planos
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveTab('artigos'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Artigos Autorais & Ensaios
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('planos'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Planos do Clube de Assinatura
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('minha-conta'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Portal do Assinante
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('admin'); window.scrollTo(0, 0); }} className="hover:text-[#c89b3c] transition">
                Painel do Administrador
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter & Boletim */}
        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#c89b3c] pl-2">
            Boletim Bibliófilo
          </h5>
          <p className="text-xs text-stone-400 mb-3">
            Receba notificações de novas aquisições de livros raros, cartas históricas e artigos inéditos.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="bg-[#181a22] border border-[#2f3340] rounded px-3 py-1.5 text-xs text-white placeholder-stone-500 w-full focus:outline-none focus:border-[#c89b3c]"
            />
            <button
              onClick={() => alert('Obrigado! Seu e-mail foi cadastrado no Boletim Bibliófilo.')}
              className="bg-[#c89b3c] hover:bg-[#d9ab4b] text-black px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-4 text-[11px] text-stone-500">
            Cupons ativos de demonstração: <span className="font-mono text-[#c89b3c]">BEMVINDO10</span> | <span className="font-mono text-[#c89b3c]">HISTORIA15</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#1a1c24] py-4 bg-[#0a0b0d] text-center text-xs text-stone-600">
        <p>© 2026 Biblioteca Contraste. Todos os direitos reservados. Preservação cultural, livros físicos e acervo digital.</p>
      </div>
    </footer>
  );
};
