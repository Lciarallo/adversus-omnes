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
import { Dialog } from './ui/Dialog';
import { ConfirmDialog, ConfirmRequest } from './ui/ConfirmDialog';
import { EmptyState } from './ui/EmptyState';
import { useToast } from './ui/Toast';

export const ArticleCMS: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    currentUser,
    selectedArticle,
    setSelectedArticle,
    setRole
  } = useStore();
  const { notify } = useToast();

  const isAdmin = currentUser.role === 'admin';

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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
      authorName: currentUser.name || 'Redação Adversus Omnes',
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
    setConfirmRequest({
      title: 'Excluir este ensaio?',
      body: `"${title}" sai do índice editorial e deixa de ser lido no site. Não há como desfazer.`,
      confirmLabel: 'Excluir ensaio',
      onConfirm: () => {
        deleteArticle(id);
        if (selectedArticle?.id === id) setSelectedArticle(null);
        notify('Ensaio excluído do índice editorial.', 'info');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Título e corpo do ensaio são obrigatórios para publicar.');
      return;
    }
    setFormError(null);

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
            className="flex items-center gap-2 text-ink-soft hover:text-ink transition text-xs font-medium min-h-[44px]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Voltar a todos os Artigos</span>
          </button>

          <div className="space-y-3 border-b border-rule pb-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-paper-400 text-rubrica border border-rule-strong">
                {selectedArticle.category}
              </span>
              <span className="text-ink-faint text-xs">•</span>
              <span className="text-xs text-ink-soft flex items-center gap-1">
                <Clock size={13} aria-hidden="true" /> {selectedArticle.readTime} de leitura
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-ink leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="text-ink-soft font-serif italic text-base sm:text-lg leading-relaxed">
              {selectedArticle.subtitle}
            </p>

            <div className="flex items-center justify-between text-xs text-ink-soft pt-2">
              <div>
                Por <strong className="text-ink">{selectedArticle.authorName}</strong> em{' '}
                {new Date(selectedArticle.publishedAt).toLocaleDateString('pt-BR')}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const url = `${window.location.origin}/?ensaio=${selectedArticle.slug}`;
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: selectedArticle.title, url });
                        return;
                      }
                      await navigator.clipboard.writeText(url);
                      notify('Link do ensaio copiado.', 'success');
                    } catch {
                      notify('Não foi possível copiar o link deste ensaio.', 'error');
                    }
                  }}
                  aria-label={`Compartilhar o ensaio ${selectedArticle.title}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-paper-600 p-2 text-ink-soft transition hover:bg-paper-300 hover:text-ink"
                >
                  <Share2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-xl overflow-hidden shadow-2xl border border-rule">
            <img
              src={selectedArticle.coverImage}
              alt={`Imagem do artigo ${selectedArticle.title}`}
              loading="lazy"
              decoding="async"
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Content */}
          <div className="ch-prose pt-4">
            {selectedArticle.content
              .split(/\n+/)
              .map(paragraph => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-rule-faint flex flex-wrap gap-2">
            {selectedArticle.tags.map(t => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-paper-600 text-ink-soft text-xs border border-rule"
              >
                #{t}
              </span>
            ))}
          </div>
        </article>
      ) : (
        /* Articles List & Grid */
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-rule-faint pb-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-ink tracking-wide">
                Artigos Autorais e Ensaios
              </h1>
              <p className="text-sm text-ink-soft font-serif italic max-w-2xl leading-relaxed">
                Reflexões aprofundadas, resenhas críticas e pesquisas arquivísticas produzidas pelo corpo editorial e pesquisadores convidados de Adversus Omnes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleOpenNew}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg bg-rubrica px-4 py-2.5 text-xs font-semibold text-paper-800 shadow-lg shadow-rubrica/20 transition hover:bg-rubrica-deep"
                >
                  <Plus size={16} aria-hidden="true" />
                  <span>Escrever ensaio</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    notify('Perfil de administrador ativado para a demonstração.', 'info');
                  }}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-rule-strong bg-paper-400 px-3.5 py-2 text-xs text-ink-soft transition hover:bg-paper-300 hover:text-ink"
                >
                  <Edit3 size={14} className="text-rubrica" aria-hidden="true" />
                  <span>Escrever como administrador</span>
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
                  ? 'bg-rubrica text-paper-800 font-semibold'
                  : 'bg-paper-700 text-ink-soft hover:text-ink border border-rule'
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
                    ? 'bg-rubrica text-paper-800 font-semibold'
                    : 'bg-paper-700 text-ink-soft hover:text-ink border border-rule'
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
                className="bg-paper-700 rounded-xl border border-rule hover:border-rubrica/60 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
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
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-paper-800/92 backdrop-blur text-rubrica border border-ocre/35">
                        {art.category}
                      </span>
                      {art.status === 'draft' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ocre-tint/90 text-ocre border border-ocre/35">
                          Rascunho
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-ink-soft font-mono">
                      <span>{new Date(art.publishedAt).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h2 className="font-serif text-lg font-bold leading-snug">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(art)}
                        className="line-clamp-2 py-1 text-left text-ink transition hover:text-rubrica"
                      >
                        {art.title}
                      </button>
                    </h2>

                    <p className="text-xs text-ink-soft line-clamp-3 leading-relaxed font-serif">
                      {art.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-rule-faint mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-ink-soft truncate">
                    Por {art.authorName}
                  </span>

                  {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(art)}
                      aria-label={`Editar artigo ${art.title}`}
                      className="p-2.5 rounded-lg text-ink-soft hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                    >
                      <Edit3 size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(art.id, art.title)}
                      aria-label={`Excluir artigo ${art.title}`}
                      className="p-2.5 rounded-lg text-ink-faint hover:text-rubrica min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <EmptyState
              icon={<FileText size={22} aria-hidden="true" />}
              title="Nenhum ensaio nesta categoria"
              body="O índice editorial ainda não tem textos publicados sob este recorte."
              action={{ label: 'Ver todas as categorias', onClick: () => setSelectedCategory('all') }}
            />
          )}
        </>
      )}

      {/* Article CMS Editor Modal */}
      <Dialog
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        labelledBy="article-modal-heading"
        panelClassName="max-h-[90svh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl border border-rule bg-paper-700 p-6 shadow-2xl"
      >
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h2 id="article-modal-heading" className="text-base font-cinzel font-bold text-ink">
                {editingArticle ? 'Editar Artigo no CMS' : 'Publicar Novo Artigo / Ensaio'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                aria-label="Fechar editor de artigos"
                className="p-2 rounded-lg text-ink-soft hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="article-title" className="text-ink-soft block mb-1">
                  Título do Artigo *
                </label>
                <input
                  id="article-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink font-serif text-sm min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="article-subtitle" className="text-ink-soft block mb-1">
                  Subtítulo / Chamada Crítica *
                </label>
                <input
                  id="article-subtitle"
                  type="text"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="article-author" className="text-ink-soft block mb-1">
                    Autor do Artigo
                  </label>
                  <input
                    id="article-author"
                    type="text"
                    value={formData.authorName}
                    onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="article-cat" className="text-ink-soft block mb-1">
                    Categoria
                  </label>
                  <input
                    id="article-cat"
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="article-status" className="text-ink-soft block mb-1">
                    Status
                  </label>
                  <select
                    id="article-status"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="article-cover" className="text-ink-soft block mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  id="article-cover"
                  type="url"
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="article-content" className="text-ink-soft block mb-1">
                  Corpo do Artigo (Texto Completo / Formatação Editorial) *
                </label>
                <textarea
                  id="article-content"
                  rows={8}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escreva seu ensaio crítico, anotações arquivísticas e referências..."
                  className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink font-serif leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="article-tags" className="text-ink-soft block mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  id="article-tags"
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ex: Filosofia Política, História, Canudos"
                  className="w-full bg-paper-600 border border-rule rounded-lg p-2.5 text-ink min-h-[44px]"
                />
              </div>

              {formError && (
                <p role="alert" className="text-[11px] text-rubrica-deep">
                  {formError}
                </p>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-paper-400 text-ink-soft hover:bg-paper-300 min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-rubrica hover:bg-rubrica-deep text-paper-800 font-semibold min-h-[44px]"
                >
                  {editingArticle ? 'Salvar Artigo' : 'Publicar Artigo'}
                </button>
              </div>
        </form>
      </Dialog>

      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
    </div>
  );
};
