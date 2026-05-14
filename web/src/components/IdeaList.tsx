import type { Idea, IdeaSearchResult } from "../lib/api";
import { IdeaCard } from "./IdeaCard";

type Props = {
  ideas: (Idea | IdeaSearchResult)[];
  empty?: string;
};

export function IdeaList({ ideas, empty }: Props) {
  if (ideas.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">{empty ?? "Nenhuma ideia encontrada."}</p>
    );
  }

  return (
    <div className="grid gap-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
