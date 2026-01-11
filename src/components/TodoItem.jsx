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

  const formatDate = (d) => {
    if (!d) return null;
    const date = d.seconds ? new Date(d.seconds * 1000) : new Date(d);
    return date.toLocaleDateString();
  };

  const isOverdue =
    todo.dueDate &&
    new Date(
      todo.dueDate.seconds
        ? todo.dueDate.seconds * 1000
        : todo.dueDate
    ) < new Date() &&
    !todo.completed;

  return (
    <li
      className="p-4 rounded-xl space-y-2 border
                 bg-[rgb(var(--card))]
                 border-[rgb(var(--border))]
                 text-[rgb(var(--text))]"
    >
      <div className="flex justify-between items-center">
        {edit ? (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={saveEdit}
            autoFocus
            className="flex-1 px-2 py-1 rounded border
                       bg-[rgb(var(--card))]
                       border-[rgb(var(--border))]
                       text-[rgb(var(--text))]"
          />
        ) : (
          <span
            onClick={() => onToggle(todo.id, todo.completed)}
            className={`cursor-pointer ${
              todo.completed ? "line-through opacity-50" : ""
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

      {todo.dueDate && (
        <div className={`text-xs ${isOverdue ? "text-red-500" : "opacity-70"}`}>
          Due: {formatDate(todo.dueDate)}
        </div>
      )}

      <div className="flex gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-blue-600 text-white">
          {todo.priority || "medium"}
        </span>
        <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
          {todo.category || "General"}
        </span>
      </div>
    </li>
  );
}
