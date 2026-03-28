import { useState } from "react";
import { useSessions, useCreateSession } from "../hooks/useSessions";
import { useQuestionLogs, useUpdateLog } from "../hooks/useQuestionLogs";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import type { QuestionLog } from "../types";

export default function ReviewScreen() {
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const createSession = useCreateSession();
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const { data: logs } = useQuestionLogs(selectedSessionId);

  const [newCompany, setNewCompany] = useState("");

  const handleCreateSession = () => {
    if (!newCompany.trim()) return;
    createSession.mutate(
      { target_company: newCompany },
      {
        onSuccess: (s) => {
          setSelectedSessionId(s.id);
          setNewCompany("");
        },
      }
    );
  };

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold mb-4">振り返り</h1>

      {/* Session selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-text-secondary block mb-1">
          セッション
        </label>
        {sessionsLoading ? (
          <p className="text-sm text-text-secondary">読み込み中...</p>
        ) : (
          <>
            <select
              value={selectedSessionId ?? ""}
              onChange={(e) =>
                setSelectedSessionId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2"
            >
              <option value="">セッションを選択...</option>
              {sessions?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.target_company || `セッション #${s.id}`} -{" "}
                  {new Date(s.created_at).toLocaleDateString("ja-JP")}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="新規セッション（企業名）"
                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={handleCreateSession}
                className="bg-primary text-white text-sm px-3 rounded-lg shrink-0"
              >
                作成
              </button>
            </div>
          </>
        )}
      </div>

      {/* Question Logs */}
      {selectedSessionId && (
        <div className="space-y-3">
          {!logs?.length ? (
            <p className="text-sm text-text-secondary text-center mt-4">
              まだログがありません
            </p>
          ) : (
            logs.map((log) => <LogEntry key={log.id} log={log} />)
          )}
        </div>
      )}
    </div>
  );
}

function LogEntry({ log }: { log: QuestionLog }) {
  const [expanded, setExpanded] = useState(false);
  const [memo, setMemo] = useState(log.actual_answer_memo);
  const [stuck, setStuck] = useState(log.stuck_points);
  const updateMut = useUpdateLog();

  const handleSave = () => {
    updateMut.mutate({
      logId: log.id,
      data: { actual_answer_memo: memo, stuck_points: stuck },
    });
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <span className="font-medium text-sm">{log.question_text}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          {log.drafted_answer && (
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1">
                生成された草案
              </p>
              <p className="text-sm bg-surface rounded p-2 whitespace-pre-wrap">
                {log.drafted_answer}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">
              実際の回答メモ
            </p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              rows={3}
              placeholder="実際にどう答えたか..."
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">
              詰まった点
            </p>
            <textarea
              value={stuck}
              onChange={(e) => setStuck(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              rows={2}
              placeholder="ここで詰まった..."
            />
          </div>
          <button
            onClick={handleSave}
            disabled={updateMut.isPending}
            className="flex items-center gap-1 bg-primary text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            <Save size={14} /> 保存
          </button>
        </div>
      )}
    </div>
  );
}
