import { useState } from "react";
import { Plus } from "lucide-react";
import {
  useFragments,
  useCreateFragment,
  useUpdateFragment,
  useDeleteFragment,
} from "../hooks/useFragments";
import FragmentCard from "../components/fragments/FragmentCard";
import FragmentForm from "../components/fragments/FragmentForm";
import type { Fragment, FragmentCreate } from "../types";

export default function FragmentManagement() {
  const { data: fragments, isLoading } = useFragments();
  const createMut = useCreateFragment();
  const updateMut = useUpdateFragment();
  const deleteMut = useDeleteFragment();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Fragment | null>(null);

  const handleSubmit = (data: FragmentCreate) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.id, data },
        { onSuccess: () => { setEditing(null); setShowForm(false); } }
      );
    } else {
      createMut.mutate(data, {
        onSuccess: () => setShowForm(false),
      });
    }
  };

  const handleEdit = (f: Fragment) => {
    setEditing(f);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("このカードを削除しますか？")) {
      deleteMut.mutate(id);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">断片カード</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1 bg-primary text-white text-sm px-3 py-1.5 rounded-lg"
        >
          <Plus size={16} /> 追加
        </button>
      </div>

      {isLoading ? (
        <p className="text-text-secondary text-sm text-center mt-8">読み込み中...</p>
      ) : !fragments?.length ? (
        <p className="text-text-secondary text-sm text-center mt-8">
          カードがありません。「追加」から作成してください。
        </p>
      ) : (
        <div className="space-y-3">
          {fragments.map((f) => (
            <FragmentCard
              key={f.id}
              fragment={f}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <FragmentForm
          initial={editing}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
