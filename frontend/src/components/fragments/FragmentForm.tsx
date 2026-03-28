import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Fragment, FragmentCreate } from "../../types";

interface Props {
  initial?: Fragment | null;
  onSubmit: (data: FragmentCreate) => void;
  onClose: () => void;
}

export default function FragmentForm({ initial, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [lesson, setLesson] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [sourceCompany, setSourceCompany] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setSummary(initial.summary);
      setDetail(initial.detail);
      setLesson(initial.lesson);
      setTagsStr(initial.tags.join(", "));
      setSourceCompany(initial.source_company);
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      summary,
      detail,
      lesson,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      source_company: sourceCompany,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">
            {initial ? "カード編集" : "新規カード"}
          </h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="タイトル" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="概要（結論）">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="input"
              rows={2}
            />
          </Field>
          <Field label="詳細（具体例）">
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="input"
              rows={3}
            />
          </Field>
          <Field label="学び">
            <textarea
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="input"
              rows={2}
            />
          </Field>
          <Field label="タグ（カンマ区切り）">
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="input"
              placeholder="強み, 技術"
            />
          </Field>
          <Field label="関連企業">
            <input
              value={sourceCompany}
              onChange={(e) => setSourceCompany(e.target.value)}
              className="input"
            />
          </Field>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {initial ? "更新" : "作成"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="mt-1 [&_.input]:w-full [&_.input]:border [&_.input]:border-border [&_.input]:rounded-lg [&_.input]:px-3 [&_.input]:py-2 [&_.input]:text-sm [&_.input]:outline-none [&_.input]:focus:border-primary">
        {children}
      </div>
    </label>
  );
}
