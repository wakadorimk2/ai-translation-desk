import { Pencil, Trash2 } from "lucide-react";
import type { Fragment } from "../../types";

interface Props {
  fragment: Fragment;
  onEdit: (f: Fragment) => void;
  onDelete: (id: number) => void;
}

export default function FragmentCard({ fragment, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-tight">{fragment.title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(fragment)}
            className="p-1.5 text-text-secondary hover:text-primary rounded"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(fragment.id)}
            className="p-1.5 text-text-secondary hover:text-red-500 rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fragment.summary && (
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
          {fragment.summary}
        </p>
      )}
      {fragment.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {fragment.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
