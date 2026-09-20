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
import { Dialog } from './ui/Dialog';
import { ConfirmDialog, ConfirmRequest } from './ui/ConfirmDialog';
import { EmptyState } from './ui/EmptyState';
import { useToast } from './ui/Toast';

export const AuthorManager: React.FC = () => {
  const {
    authors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    currentUser,
    catalog,
    openReader,
    setActiveTab,
    setRole
  } = useStore();
  const { notify } = useToast();

  const isAdmin = currentUser.role === 'admin';

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
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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
    setConfirmRequest({
      title: 'Remover este autor do catálogo?',
      body: `${name} sai do índice de autores e deixa de ligar suas obras ao movimento e ao período. As obras permanecem no acervo, sem a ficha do autor. Não há como desfazer.`,
      confirmLabel: 'Remover autor',
      onConfirm: () => {
        deleteAuthor(id);
        if (viewAuthor?.id === id) setViewAuthor(null);
        notify(`${name} foi removido do índice de autores.`, 'info');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('O nome do autor é obrigatório: é ele que liga a ficha às obras do acervo.');
      return;
    }
    setFormError(null);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line-soft pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
            Autores e suas Obras
          </h1>
          <p className="text-sm text-stone-400 font-serif italic max-w-2xl leading-relaxed">
            Catálogo biobibliográfico completo de pensadores políticos, filósofos, sociólogos e romancistas que moldaram o debate de ideias ao longo dos séculos.
          </p>
        </div>

        {/* Catalogação é trabalho de administrador: o visitante vê o índice,
            e tem um caminho explícito para assumir o perfil na demonstração. */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-gold/20 transition hover:bg-gold-light"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Cadastrar autor</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                notify('Perfil de administrador ativado para a demonstração.', 'info');
              }}
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line-strong bg-ink-500 px-3.5 py-2 text-xs text-stone-300 transition hover:bg-ink-400 hover:text-white"
            >
              <UserCheck size={14} className="text-gold" aria-hidden="true" />
              <span>Catalogar como administrador</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-ink-700 p-4 rounded-xl border border-line grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dust pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Buscar autor por nome, tema ou obra"
            placeholder="Buscar autor, tema ou obra..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-ink-800 border border-line-mid rounded-lg text-xs text-white placeholder-dust focus:outline-none focus:border-gold min-h-[44px]"
          />
        </div>

        {/* Movement Filter */}
        <div>
          <select
            aria-label="Filtrar por movimento político ou filosófico"
            value={selectedMovement}
            onChange={e => setSelectedMovement(e.target.value)}
            className="w-full bg-ink-800 border border-line-mid rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold min-h-[44px]"
          >
            <option value="all">Todos os Movimentos Políticos / Ideias</option>
            {movements.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div>
          <select
            aria-label="Filtrar por período histórico de atuação"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="w-full bg-ink-800 border border-line-mid rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold min-h-[44px]"
          >
            <option value="all">Todos os Períodos Históricos</option>
            {periods.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map(author => (
          <div
            key={author.id}
            className="bg-ink-700 rounded-xl border border-line hover:border-gold/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={author.avatar}
                  alt={`Retrato de ${author.name}`}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-full object-cover border-2 border-line-strong group-hover:border-gold transition shrink-0 shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ink-450 text-stone-300 border border-line-strong">
                      {author.period}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-gold border border-amber-800/40">
                      {author.politicalMovement}
                    </span>
                  </div>
                  <h2 className="text-base font-cinzel font-bold text-white mt-1.5 truncate group-hover:text-gold transition">
                    {author.name}
                  </h2>
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
                    className="px-2 py-0.5 rounded-full bg-ink-600 text-stone-400 text-[10px] border border-line-mid"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Works overview */}
              <div className="pt-2 border-t border-line-soft space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 block">
                  Obras de Referência:
                </span>
                <ul className="text-xs text-stone-300 space-y-0.5">
                  {author.works.slice(0, 3).map((w, idx) => (
                    <li key={idx} className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
                      <span className="italic">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-6 py-3 bg-ink-750 border-t border-line-soft flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setViewAuthor(author)}
                className="text-gold hover:underline font-medium flex items-center gap-1 min-h-[44px]"
              >
                <BookOpen size={14} aria-hidden="true" />
                <span>Ver Biografia Completa</span>
              </button>

              {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(author)}
                  aria-label={`Editar autor ${author.name}`}
                  className="p-2.5 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                >
                  <Edit2 size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAuthor(author.id, author.name)}
                  aria-label={`Excluir autor ${author.name}`}
                  className="p-2.5 rounded-lg text-dust hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <EmptyState
          icon={<Search size={22} aria-hidden="true" />}
          title="Nenhum autor com esses critérios"
          body="A combinação de busca, movimento e período não encontrou ninguém no índice. Amplie um dos filtros para voltar ao catálogo completo."
          action={{
            label: 'Limpar filtros',
            onClick: () => {
              setSearchQuery('');
              setSelectedMovement('all');
              setSelectedPeriod('all');
            }
          }}
        />
      )}

      {/* Author Details Modal */}
      <Dialog
        open={!!viewAuthor}
        onClose={() => setViewAuthor(null)}
        labelledBy="author-detail-title"
        panelClassName="max-h-[90svh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-xl border border-line-mid bg-ink-700 p-6 shadow-2xl"
      >
        {viewAuthor && (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={viewAuthor.avatar}
                  alt={`Foto de ${viewAuthor.name}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gold"
                />
                <div>
                  <h2 id="author-detail-title" className="text-xl font-cinzel font-bold text-white">
                    {viewAuthor.name}
                  </h2>
                  <div className="text-xs text-gold font-mono mt-0.5">
                    {viewAuthor.politicalMovement} • {viewAuthor.period}
                  </div>
                  <div className="text-xs text-stone-400 font-mono">
                    {viewAuthor.birthYear} — {viewAuthor.deathYear}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewAuthor(null)}
                aria-label="Fechar biografia"
                className="p-2 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-1">
                Trajetória Intelectual e Biografia
              </h3>
              <p className="text-stone-200 text-sm leading-relaxed font-serif">
                {viewAuthor.bio}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                Obras Registradas em Contra Homines
              </h3>
              <div className="space-y-2">
                {viewAuthor.works.map((w, idx) => {
                  const catalogMatch = catalog.find(
                    c => c.title.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(c.title.toLowerCase())
                  );

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-ink-550 border border-line-mid flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-gold" aria-hidden="true" />
                        <span className="text-white font-medium italic">{w}</span>
                      </div>
                      {catalogMatch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setViewAuthor(null);
                            if (catalogMatch.type === 'physical') {
                              setActiveTab('fisico');
                            } else {
                              openReader(catalogMatch);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition text-[11px] min-h-[36px]"
                        >
                          Ver no Acervo ({catalogMatch.type === 'physical' ? 'Físico' : 'Digital'})
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-400">Catalogação em andamento</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

        <div className="flex justify-end border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setViewAuthor(null)}
            className="min-h-[44px] rounded-lg bg-ink-500 px-4 py-2.5 text-xs text-stone-300 transition hover:bg-ink-400"
          >
            Fechar
          </button>
        </div>
          </>
        )}
      </Dialog>

      {/* CRUD Modal for Add/Edit Author */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        labelledBy="author-crud-title"
        panelClassName="max-h-[90svh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl border border-line-mid bg-ink-700 p-6 shadow-2xl"
      >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 id="author-crud-title" className="text-base font-cinzel font-bold text-white">
                {editingAuthor ? 'Editar Informações do Autor' : 'Cadastrar Novo Autor'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar formulário de autor"
                className="p-2 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="author-fullname" className="text-stone-300 block mb-1">
                  Nome Completo *
                </label>
                <input
                  id="author-fullname"
                  type="text"
                  required
                  aria-invalid={!!formError}
                  aria-describedby={formError ? 'author-fullname-erro' : undefined}
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  className={`min-h-[44px] w-full rounded-lg border bg-ink-800 p-2.5 text-white focus:outline-none ${
                    formError ? 'border-red-700 focus:border-red-500' : 'border-line-mid focus:border-gold'
                  }`}
                />
                {formError && (
                  <p id="author-fullname-erro" role="alert" className="mt-1.5 text-[11px] text-red-300">
                    {formError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="author-birth" className="text-stone-300 block mb-1">
                    Ano de Nascimento
                  </label>
                  <input
                    id="author-birth"
                    type="number"
                    value={formData.birthYear}
                    onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="author-death" className="text-stone-300 block mb-1">
                    Ano de Falecimento
                  </label>
                  <input
                    id="author-death"
                    type="number"
                    value={formData.deathYear}
                    onChange={e => setFormData({ ...formData, deathYear: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="author-period" className="text-stone-300 block mb-1">
                    Período Histórico
                  </label>
                  <input
                    id="author-period"
                    type="text"
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="author-movement" className="text-stone-300 block mb-1">
                    Movimento Político / Corrente
                  </label>
                  <input
                    id="author-movement"
                    type="text"
                    value={formData.politicalMovement}
                    onChange={e => setFormData({ ...formData, politicalMovement: e.target.value })}
                    className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="author-avatar" className="text-stone-300 block mb-1">
                  URL da Foto / Retrato Histórico
                </label>
                <input
                  id="author-avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="author-bio" className="text-stone-300 block mb-1">
                  Biografia e Contexto Histórico
                </label>
                <textarea
                  id="author-bio"
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label htmlFor="author-themes" className="text-stone-300 block mb-1">
                  Temas Principais (separados por vírgula)
                </label>
                <input
                  id="author-themes"
                  type="text"
                  value={formData.themes}
                  onChange={e => setFormData({ ...formData, themes: e.target.value })}
                  placeholder="Ex: Democracia, Economia Política, Filosofia"
                  className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="author-works" className="text-stone-300 block mb-1">
                  Obras Principais (separadas por vírgula)
                </label>
                <input
                  id="author-works"
                  type="text"
                  value={formData.works}
                  onChange={e => setFormData({ ...formData, works: e.target.value })}
                  placeholder="Ex: A Democracia na América, O Antigo Regime"
                  className="w-full bg-ink-800 border border-line-mid rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-ink-500 text-stone-300 hover:bg-ink-400 min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold min-h-[44px]"
                >
                  {editingAuthor ? 'Salvar Alterações' : 'Cadastrar Autor'}
                </button>
              </div>
        </form>
      </Dialog>

      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
    </div>
  );
};
