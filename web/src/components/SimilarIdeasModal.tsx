import { useSimilarIdeas } from "../hooks/useSimilarIdeas";
import type { Idea } from "../lib/api";
import { IdeaCard } from "./IdeaCard";

type Props = {
  idea: Idea | null;
  onClose: () => void;
};

export function SimilarIdeasModal({ idea, onClose }: Props) {
  const { results, loading, error } = useSimilarIdeas(idea?.id ?? null);

  if (!idea) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Ideias similares a
              </p>
              <h2 className="text-lg font-bold text-slate-900">{idea.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          {loading && <p className="text-sm text-slate-500">Carregando...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Nenhuma ideia similar encontrada.
            </p>
          )}
          {!loading && results.length > 0 && (
            <div className="grid gap-3">
              {results.map((similar) => (
                <IdeaCard key={similar.id} idea={similar} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
