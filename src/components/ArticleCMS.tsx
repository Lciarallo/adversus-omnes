import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';

export const ArticleCMS: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    currentUser,
    selectedArticle,
    setSelectedArticle
  } = useStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    authorName: '',
    category: 'Filosofia Política',
    readTime: '8 min',
    tags: '',
    coverImage: '',
    content: '',
    status: 'published' as 'published' | 'draft',
    historicalPeriod: 'Século XIX'
  });

  const categories = Array.from(new Set(articles.map(a => a.category)));

  const handleOpenNew = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      subtitle: '',
      authorName: currentUser.name || 'Redação Contra Homines',
      category: 'Filosofia Política',
      readTime: '7 min',
      tags: 'Ensaio, História, Política',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
      content: '',
      status: 'published',
      historicalPeriod: 'Século XIX'
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      subtitle: art.subtitle,
      authorName: art.authorName,
      category: art.category,
      readTime: art.readTime,
      tags: art.tags.join(', '),
      coverImage: art.coverImage,
      content: art.content,
      status: art.status,
      historicalPeriod: art.historicalPeriod
    });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Excluir artigo "${title}"?`)) {
      deleteArticle(id);
      if (selectedArticle?.id === id) setSelectedArticle(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Preencha pelo menos o título e o conteúdo do artigo.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: formData.subtitle.trim(),
      authorName: formData.authorName.trim(),
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: formData.readTime.trim() || '5 min',
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage: formData.coverImage.trim(),
      content: formData.content.trim(),
      status: formData.status,
      historicalPeriod: formData.historicalPeriod
    };

    if (editingArticle) {
      updateArticle(editingArticle.id, payload);
    } else {
      addArticle(payload);
    }

    setIsEditorOpen(false);
  };

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (currentUser.role !== 'admin' && a.status === 'draft') return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Full Article Reader View */}
      {selectedArticle ? (
        <article className="max-w-3xl mx-auto space-y-6">
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition text-xs font-medium min-h-[44px]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Voltar a todos os Artigos</span>
          </button>

          <div className="space-y-3 border-b border-[#292c3a] pb-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#212431] text-[#c89b3c] border border-[#323648]">
                {selectedArticle.category}
              </span>
              <span className="text-dust text-xs">•</span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock size={13} aria-hidden="true" /> {selectedArticle.readTime} de leitura
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="text-stone-300 font-serif italic text-base sm:text-lg leading-relaxed">
              {selectedArticle.subtitle}
            </p>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
              <div>
                Por <strong className="text-white">{selectedArticle.authorName}</strong> em{' '}
                {new Date(selectedArticle.publishedAt).toLocaleDateString('pt-BR')}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Link copiado para a área de transferência!')}
                  aria-label="Compartilhar artigo"
                  className="p-2 rounded-lg bg-[#1f222c] hover:bg-[#2c303f] text-stone-300 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Share2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-xl overflow-hidden shadow-2xl border border-[#2e3343]">
            <img
              src={selectedArticle.coverImage}
              alt={`Imagem do artigo ${selectedArticle.title}`}
              loading="lazy"
              decoding="async"
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none text-stone-200 font-serif text-lg leading-relaxed space-y-6 pt-4 whitespace-pre-line">
            {selectedArticle.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-[#262936] flex flex-wrap gap-2">
            {selectedArticle.tags.map(t => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-[#1b1e27] text-stone-400 text-xs border border-[#2b2f3d]"
              >
                #{t}
              </span>
            ))}
          </div>
        </article>
      ) : (
        /* Articles List & Grid */
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#252834] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#c89b3c] text-xs uppercase tracking-widest font-mono">
                <FileText size={14} aria-hidden="true" /> Espaço Editorial & Blog Cultural
              </div>
              <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mt-1">
                Artigos Autorais e Ensaios
              </h1>
              <p className="text-sm text-stone-400 font-serif italic mt-1 max-w-2xl">
                Reflexões aprofundadas, resenhas críticas e pesquisas arquivísticas produzidas pelo corpo editorial e pesquisadores convidados de Contra Homines.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  type="button"
                  onClick={handleOpenNew}
                  className="px-4 py-2.5 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-[#c89b3c]/20 min-h-[44px]"
                >
                  <Plus size={16} aria-hidden="true" />
                  <span>Escrever Novo Artigo (CMS)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenNew}
                  className="px-3.5 py-2 rounded-lg bg-[#20232e] hover:bg-[#2c303f] text-stone-300 text-xs border border-[#353a4b] transition flex items-center gap-1.5 min-h-[44px]"
                >
                  <Plus size={14} className="text-[#c89b3c]" aria-hidden="true" />
                  <span>Novo Artigo (Admin)</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div role="group" aria-label="Filtro de categorias de artigos" className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center ${
                selectedCategory === 'all'
                  ? 'bg-[#c89b3c] text-black font-semibold'
                  : 'bg-[#181a22] text-stone-400 hover:text-white border border-[#272b38]'
              }`}
            >
              Todas as Categorias
            </button>
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center ${
                  selectedCategory === c
                    ? 'bg-[#c89b3c] text-black font-semibold'
                    : 'bg-[#181a22] text-stone-400 hover:text-white border border-[#272b38]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                className="bg-[#15171f] rounded-xl border border-[#272b38] hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={art.coverImage}
                      alt={`Imagem do artigo ${art.title}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-black/85 backdrop-blur text-[#c89b3c] border border-amber-900/40">
                        {art.category}
                      </span>
                      {art.status === 'draft' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-950/90 text-yellow-300 border border-yellow-800">
                          Rascunho
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                      <span>{new Date(art.publishedAt).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h2
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelectedArticle(art)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedArticle(art);
                        }
                      }}
                      className="text-lg font-serif font-bold text-white hover:text-[#c89b3c] cursor-pointer transition line-clamp-2"
                    >
                      {art.title}
                    </h2>

                    <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed font-serif">
                      {art.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#20232f] mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 truncate">
                    Por {art.authorName}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(art)}
                      aria-label={`Editar artigo ${art.title}`}
                      className="p-2.5 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                    >
                      <Edit3 size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(art.id, art.title)}
                      aria-label={`Excluir artigo ${art.title}`}
                      className="p-2.5 rounded-lg text-dust hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Article CMS Editor Modal */}
      {isEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-heading"
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
        >
          <div
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-[#161821] border border-[#2d3242] rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a37] pb-3">
              <h2 id="article-modal-heading" className="text-base font-cinzel font-bold text-white">
                {editingArticle ? 'Editar Artigo no CMS' : 'Publicar Novo Artigo / Ensaio'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                aria-label="Fechar editor de artigos"
                className="p-2 rounded-lg text-stone-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="article-title" className="text-stone-300 block mb-1">
                  Título do Artigo *
                </label>
                <input
                  id="article-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white font-serif text-sm min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="article-subtitle" className="text-stone-300 block mb-1">
                  Subtítulo / Chamada Crítica *
                </label>
                <input
                  id="article-subtitle"
                  type="text"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="article-author" className="text-stone-300 block mb-1">
                    Autor do Artigo
                  </label>
                  <input
                    id="article-author"
                    type="text"
                    value={formData.authorName}
                    onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="article-cat" className="text-stone-300 block mb-1">
                    Categoria
                  </label>
                  <input
                    id="article-cat"
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="article-status" className="text-stone-300 block mb-1">
                    Status
                  </label>
                  <select
                    id="article-status"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="article-cover" className="text-stone-300 block mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  id="article-cover"
                  type="url"
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="article-content" className="text-stone-300 block mb-1">
                  Corpo do Artigo (Texto Completo / Formatação Editorial) *
                </label>
                <textarea
                  id="article-content"
                  rows={8}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escreva seu ensaio crítico, anotações arquivísticas e referências..."
                  className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white font-serif leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="article-tags" className="text-stone-300 block mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  id="article-tags"
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ex: Filosofia Política, História, Canudos"
                  className="w-full bg-[#101217] border border-[#2e3343] rounded-lg p-2.5 text-white min-h-[44px]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-[#222530] text-stone-300 hover:bg-[#2b2f3e] min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#c89b3c] hover:bg-[#d9ab4b] text-black font-semibold min-h-[44px]"
                >
                  {editingArticle ? 'Salvar Artigo' : 'Publicar Artigo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
