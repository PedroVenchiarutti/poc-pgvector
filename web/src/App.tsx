import { useState } from "react";
import { SearchInput } from "./components/SearchInput";
import { IdeaList } from "./components/IdeaList";
import { CreateIdeaModal } from "./components/CreateIdeaModal";
import { useSearch } from "./hooks/useSearch";
import { useIdeas } from "./hooks/useIdeas";

export default function App() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { results, loading: searching, error: searchError } = useSearch(query);
  const { ideas, loading: loadingAll, error: loadError, refresh } = useIdeas();

  const showingSearch = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Busca Semântica de Ideias</h1>
            <p className="text-sm text-slate-600 mt-1">
              POC pgvector + Transformers.js. Digite um assunto e veja as ideias mais próximas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            + Nova ideia
          </button>
        </header>

        <div className="mb-6">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {showingSearch ? (
          <section>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Resultados {searching && "(buscando...)"}
            </h2>
            {searchError && <p className="text-sm text-red-600 mb-3">{searchError}</p>}
            <IdeaList ideas={results} empty="Nenhuma ideia similar." />
          </section>
        ) : (
          <section>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Todas as ideias {loadingAll && "(carregando...)"}
            </h2>
            {loadError && <p className="text-sm text-red-600 mb-3">{loadError}</p>}
            <IdeaList ideas={ideas} />
          </section>
        )}
      </div>

      <CreateIdeaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}
