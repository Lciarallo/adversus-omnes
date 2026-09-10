import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Compass,
  Search,
  Check,
  X,
  UserCheck,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Author } from '../types';

export const AuthorManager: React.FC = () => {
  const {
    authors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    currentUser,
    catalog,
    openReader,
    setActiveTab
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovement, setSelectedMovement] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  // Modal State for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    pseudonym: '',
    avatar: '',
    bio: '',
    birthYear: '',
    deathYear: '',
    period: 'Século XIX',
    politicalMovement: 'Liberalismo Clássico',
    themes: '',
    works: '',
    featured: false
  });

  // Detailed View Modal
  const [viewAuthor, setViewAuthor] = useState<Author | null>(null);

  const movements = Array.from(new Set(authors.map(a => a.politicalMovement)));
  const periods = Array.from(new Set(authors.map(a => a.period)));

  const filteredAuthors = authors.filter(author => {
    const matchesSearch =
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.works.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMovement = selectedMovement === 'all' || author.politicalMovement === selectedMovement;
    const matchesPeriod = selectedPeriod === 'all' || author.period === selectedPeriod;

    return matchesSearch && matchesMovement && matchesPeriod;
  });

  const handleOpenAddModal = () => {
    setEditingAuthor(null);
    setFormData({
      name: '',
      pseudonym: '',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      bio: '',
      birthYear: '',
      deathYear: '',
      period: 'Século XIX',
      politicalMovement: 'Liberalismo Clássico',
      themes: 'Filosofia, Política, Sociedade',
      works: 'Obra Principal I, Obra Principal II',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      pseudonym: author.pseudonym || '',
      avatar: author.avatar,
      bio: author.bio,
      birthYear: author.birthYear ? String(author.birthYear) : '',
      deathYear: author.deathYear ? String(author.deathYear) : '',
      period: author.period,
      politicalMovement: author.politicalMovement,
      themes: author.themes.join(', '),
      works: author.works.join(', '),
      featured: !!author.featured
    });
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o autor "${name}"?`)) {
      deleteAuthor(id);
      if (viewAuthor?.id === id) setViewAuthor(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Por favor, informe o nome do autor.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      pseudonym: formData.pseudonym.trim() || undefined,
      avatar: formData.avatar.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      bio: formData.bio.trim(),
      birthYear: formData.birthYear ? Number(formData.birthYear) : undefined,
      deathYear: formData.deathYear ? Number(formData.deathYear) : undefined,
      period: formData.period,
      politicalMovement: formData.politicalMovement,
      themes: formData.themes.split(',').map(t => t.trim()).filter(Boolean),
      works: formData.works.split(',').map(w => w.trim()).filter(Boolean),
      featured: formData.featured
    };

    if (editingAuthor) {
      updateAuthor(editingAuthor.id, payload);
    } else {
      addAuthor(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#252834] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
            <Compass size={14} /> Pensadores, Teóricos e Escritores
          </div>
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mt-1">
            Autores e suas Obras
          </h1>
          <p className="text-sm text-stone-400 font-serif italic mt-1 max-w-2xl">
            Catálogo biobibliográfico completo de pensadores políticos, filósofos, sociólogos e romancistas que moldaram o debate de ideias ao longo dos séculos.
          </p>
        </div>

        {/* Add Author Action Button (Highlight for admin, or available to test) */}
        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' ? (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-[#c89b3c]/20"
            >
              <Plus size={16} />
              <span>Novo Autor</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded bg-[#20232e] hover:bg-[#2c303f] text-stone-300 text-xs border border-[#353a4b] transition flex items-center gap-1.5"
              title="Disponível para teste administrativo"
            >
              <Plus size={14} className="text-[#c89b3c]" />
              <span>Cadastrar Autor (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15171e] p-4 rounded-xl border border-[#272a37] grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar autor, tema ou obra..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#101217] border border-[#2f3342] rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c89b3c]"
          />
        </div>

        {/* Movement Filter */}
        <select
          value={selectedMovement}
          onChange={e => setSelectedMovement(e.target.value)}
          className="bg-[#101217] border border-[#2f3342] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c89b3c]"
        >
          <option value="all">Todos os Movimentos Políticos / Ideias</option>
          {movements.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Period Filter */}
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          className="bg-[#101217] border border-[#2f3342] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c89b3c]"
        >
          <option value="all">Todos os Períodos Históricos</option>
          {periods.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map(author => (
          <div
            key={author.id}
            className="bg-[#15171e] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#373c4d] group-hover:border-[#c89b3c] transition shrink-0 shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#232734] text-stone-300 border border-[#34394c]">
                      {author.period}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-[#c89b3c] border border-amber-800/40">
                      {author.politicalMovement}
                    </span>
                  </div>
                  <h3 className="text-base font-cinzel font-bold text-white mt-1.5 truncate group-hover:text-[#c89b3c] transition">
                    {author.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-mono">
                    {author.birthYear && author.deathYear
                      ? `${author.birthYear} — ${author.deathYear}`
                      : author.birthYear
                      ? `Nasc. ${author.birthYear}`
                      : ''}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed font-serif">
                {author.bio}
              </p>

              {/* Themes */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {author.themes.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full bg-[#1b1e27] text-stone-400 text-[10px] border border-[#2c303f]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Works overview */}
              <div className="pt-2 border-t border-[#232634] space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 block">
                  Obras de Referência:
                </span>
                <ul className="text-xs text-stone-300 space-y-0.5">
                  {author.works.slice(0, 3).map((w, idx) => (
                    <li key={idx} className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c89b3c]" />
                      <span className="italic">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-6 py-3 bg-[#111318] border-t border-[#222532] flex items-center justify-between text-xs">
              <button
                onClick={() => setViewAuthor(author)}
                className="text-[#c89b3c] hover:underline font-medium flex items-center gap-1"
              >
                <BookOpen size={13} />
                <span>Ver Biografia Completa</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(author)}
                  className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-[#20232e] transition"
                  title="Editar autor"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteAuthor(author.id, author.name)}
                  className="p-1.5 rounded text-stone-500 hover:text-red-400 hover:bg-[#20232e] transition"
                  title="Excluir autor"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Author Details Modal */}
      {viewAuthor && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setViewAuthor(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl bg-[#161821] border border-[#2d3242] rounded-xl shadow-2xl p-6 z-10 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={viewAuthor.avatar}
                  alt={viewAuthor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#c89b3c]"
                />
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">{viewAuthor.name}</h2>
                  <div className="text-xs text-[#c89b3c] font-mono mt-0.5">
                    {viewAuthor.politicalMovement} • {viewAuthor.period}
                  </div>
                  <div className="text-xs text-stone-400 font-mono">
                    {viewAuthor.birthYear} — {viewAuthor.deathYear}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewAuthor(null)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-1">
                Trajetória Intelectual e Biografia
              </h4>
              <p className="text-stone-200 text-sm leading-relaxed font-serif">
                {viewAuthor.bio}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                Obras Registradas na Biblioteca Contraste
              </h4>
              <div className="space-y-2">
                {viewAuthor.works.map((w, idx) => {
                  const catalogMatch = catalog.find(
                    c => c.title.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(c.title.toLowerCase())
                  );

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[#1c1f2a] border border-[#2d3244] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-[#c89b3c]" />
                        <span className="text-white font-medium italic">{w}</span>
                      </div>
                      {catalogMatch ? (
                        <button
                          onClick={() => {
                            setViewAuthor(null);
                            if (catalogMatch.type === 'physical') {
                              setActiveTab('fisico');
                            } else {
                              openReader(catalogMatch);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#c89b3c] text-black font-semibold hover:bg-[#d9ab4b] transition text-[11px]"
                        >
                          Ver no Acervo ({catalogMatch.type === 'physical' ? 'Físico' : 'Digital'})
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-500">Catalogação em andamento</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#262a37] flex justify-end">
              <button
                onClick={() => setViewAuthor(null)}
                className="px-4 py-2 rounded bg-[#222530] text-stone-300 hover:bg-[#2b2f3e] text-xs transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Modal for Add/Edit Author */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl bg-[#161821] border border-[#2d3242] rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a37] pb-3">
              <h3 className="text-base font-cinzel font-bold text-white">
                {editingAuthor ? 'Editar Informações do Autor' : 'Cadastrar Novo Autor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white focus:outline-none focus:border-[#c89b3c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Ano de Nascimento</label>
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1">Ano de Falecimento</label>
                  <input
                    type="number"
                    value={formData.deathYear}
                    onChange={e => setFormData({ ...formData, deathYear: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Período Histórico</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1">Movimento Político / Corrente</label>
                  <input
                    type="text"
                    value={formData.politicalMovement}
                    onChange={e => setFormData({ ...formData, politicalMovement: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">URL da Foto / Retrato Histórico</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Biografia e Contexto Histórico</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">
                  Temas Principais (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.themes}
                  onChange={e => setFormData({ ...formData, themes: e.target.value })}
                  placeholder="Ex: Democracia, Economia Política, Filosofia"
                  className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">
                  Obras Principais (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.works}
                  onChange={e => setFormData({ ...formData, works: e.target.value })}
                  placeholder="Ex: A Democracia na América, O Antigo Regime"
                  className="w-full bg-[#101217] border border-[#2e3343] rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#222530] text-stone-300 hover:bg-[#2b2f3e]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold"
                >
                  {editingAuthor ? 'Salvar Alterações' : 'Cadastrar Autor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
