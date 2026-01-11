import { useState } from "react";

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(todo.text);

  const saveEdit = () => {
    if (text.trim()) {
      onUpdate(todo.id, { text });
      setEdit(false);
    }
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // Format Firestore Timestamp or JS Date
  const formatDate = (d) => {
    if (!d) return null;
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d);
    return date.toLocaleDateString();
  };

  const isOverdue = todo.dueDate
    ? new Date(
        todo.dueDate.seconds
          ? todo.dueDate.seconds * 1000
          : todo.dueDate
      ) < new Date() && !todo.completed
    : false;

  return (
    <li
      className={`p-4 rounded-xl space-y-2
        ${
          isOverdue
            ? "border border-red-400"
            : "border border-transparent"
        }
        bg-[rgb(var(--card))]
      `}
    >
      <div className="flex justify-between items-center">
        {edit ? (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={saveEdit}
            className="flex-1 px-2 py-1 rounded border"
            autoFocus
          />
        ) : (
          <span
            onClick={() => onToggle(todo.id, todo.completed)}
            className={`cursor-pointer ${
              todo.completed
                ? "line-through text-gray-400"
                : "text-[rgb(var(--text))]"
            }`}
          >
            {todo.text}
          </span>
        )}

        <div className="flex gap-2 text-sm">
          <button onClick={() => setEdit(true)}>✏️</button>
          <button onClick={() => onDelete(todo.id)}>🗑️</button>
        </div>
      </div>

      {/* Date */}
      {todo.dueDate && (
        <div
          className={`text-xs ${
            isOverdue ? "text-red-500" : "text-gray-500"
          }`}
        >
          Due: {formatDate(todo.dueDate)}
        </div>
      )}

      {/* Badges */}
      <div className="flex gap-2 text-xs">
        <span
          className={`px-2 py-1 rounded ${
            priorityColor[todo.priority || "medium"]
          }`}
        >
          {todo.priority || "medium"}
        </span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
          {todo.category || "General"}
        </span>
      </div>
    </li>
  );
}
