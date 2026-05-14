import type { Idea, IdeaSearchResult } from "../lib/api";

type Props = {
  idea: Idea | IdeaSearchResult;
  onShowSimilar?: (idea: Idea) => void;
};

function isSearchResult(idea: Idea | IdeaSearchResult): idea is IdeaSearchResult {
  return "similarityPercent" in idea;
}

function similarityColor(percent: number): string {
  if (percent >= 70) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (percent >= 50) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
}

export function IdeaCard({ idea, onShowSimilar }: Props) {
  const search = isSearchResult(idea) ? idea : null;

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-slate-900 flex-1">{idea.title}</h3>
        {search && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded border whitespace-nowrap ${similarityColor(
              search.similarityPercent
            )}`}
          >
            {search.similarityPercent.toFixed(2)}%
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{idea.description}</p>

      {onShowSimilar && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onShowSimilar(idea)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Ver ideias similares →
          </button>
        </div>
      )}
    </article>
  );
}
