import { useState } from "react";
import { Search, Sparkles, Check, Save } from "lucide-react";
import { useSearchFragments, useGenerateDraft } from "../hooks/useGenerate";
import { useSessions, useCreateSession } from "../hooks/useSessions";
import { useCreateLog } from "../hooks/useQuestionLogs";
import type { SearchResult } from "../types";

export default function ConversationSupport() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: sessions } = useSessions();
  const createSession = useCreateSession();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [newCompany, setNewCompany] = useState("");

  const searchMut = useSearchFragments();
  const draftMut = useGenerateDraft();
  const createLogMut = useCreateLog();

  const handleSearch = () => {
    if (!question.trim()) return;
    setSaved(false);
    searchMut.mutate(
      { question },
      {
        onSuccess: (data) => {
          setResults(data.results);
          setSelectedIds(new Set(data.results.map((r) => r.fragment.id)));
          setDraft("");
        },
      }
    );
  };

  const toggleFragment = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    if (selectedIds.size === 0) return;
    draftMut.mutate(
      { question, fragmentIds: [...selectedIds] },
      { onSuccess: (data) => setDraft(data.drafted_answer) }
    );
  };

  const handleCreateSession = () => {
    if (!newCompany.trim()) return;
    createSession.mutate(
      { target_company: newCompany },
      {
        onSuccess: (s) => {
          setSessionId(s.id);
          setNewCompany("");
        },
      }
    );
  };

  const handleSaveLog = () => {
    if (!sessionId || !question.trim()) return;
    createLogMut.mutate(
      {
        sessionId,
        data: {
          question_text: question,
          suggested_fragment_ids: results.map((r) => r.fragment.id),
          selected_fragment_ids: [...selectedIds],
          drafted_answer: draft,
        },
      },
      { onSuccess: () => setSaved(true) }
    );
  };

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold mb-3">面接サポート</h1>

      {/* Session selector */}
      <div className="mb-4 flex gap-2">
        <select
          value={sessionId ?? ""}
          onChange={(e) =>
            setSessionId(e.target.value ? Number(e.target.value) : null)
          }
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">セッション未選択</option>
          {sessions?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.target_company || `#${s.id}`}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          <input
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            placeholder="企業名"
            className="w-24 border border-border rounded-lg px-2 py-2 text-sm"
          />
          <button
            onClick={handleCreateSession}
            className="bg-primary text-white text-xs px-2 rounded-lg shrink-0"
          >
            新規
          </button>
        </div>
      </div>

      {/* Question Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="質問を入力..."
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={handleSearch}
          disabled={searchMut.isPending}
          className="bg-primary text-white px-3 rounded-lg shrink-0 disabled:opacity-50"
        >
          <Search size={18} />
        </button>
      </div>

      {searchMut.isPending && (
        <p className="text-text-secondary text-sm text-center">検索中...</p>
      )}

      {/* Candidate Fragments */}
      {results.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-text-secondary mb-2">
            関連カード ({results.length}件)
          </h2>
          <div className="space-y-2">
            {results.map(({ fragment, score }) => (
              <button
                key={fragment.id}
                onClick={() => toggleFragment(fragment.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedIds.has(fragment.id)
                    ? "border-primary bg-blue-50"
                    : "border-border bg-white"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedIds.has(fragment.id)
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {selectedIds.has(fragment.id) && <Check size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {fragment.title}
                      </span>
                      <span className="text-xs text-text-secondary shrink-0">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                    {fragment.summary && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {fragment.summary}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={draftMut.isPending || selectedIds.size === 0}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            <Sparkles size={16} />
            {draftMut.isPending ? "生成中..." : "回答草案を生成"}
          </button>
        </div>
      )}

      {/* Draft Answer */}
      {draft && (
        <div className="bg-white border border-border rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold text-text-secondary mb-2">
            回答草案
          </h2>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {draft}
          </div>
        </div>
      )}

      {/* Save to log */}
      {draft && sessionId && (
        <button
          onClick={handleSaveLog}
          disabled={createLogMut.isPending || saved}
          className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          <Save size={14} />
          {saved ? "保存済み" : "ログに保存"}
        </button>
      )}
    </div>
  );
}
