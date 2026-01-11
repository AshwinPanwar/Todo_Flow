import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useTodos } from "../hooks/useTodos";

export default function TodoForm() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const { todos } = useTodos(auth.currentUser?.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !text.trim()) return;

    const normalized = text.trim().toLowerCase();

    // Instant duplicate check from live todos
    if (todos.some(t => t.text.toLowerCase() === normalized)) {
      setError("This task already exists");
      return;
    }

    setError("");

    const tempText = text;
    setText("");
    setDueDate("");

    try {
      await addDoc(collection(db, "todos"), {
        text: tempText,
        normalizedText: normalized,
        completed: false,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: serverTimestamp(),
        uid: auth.currentUser.uid,
      });
    } catch {
      setText(tempText);
      setError("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="w-full px-4 py-2 rounded-xl border
                   bg-[rgb(var(--card))]
                   border-[rgb(var(--border))]
                   text-[rgb(var(--text))]"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border
                     bg-[rgb(var(--card))]
                     border-[rgb(var(--border))]
                     text-[rgb(var(--text))]"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="flex-1 px-3 py-2 rounded-lg border
                     bg-[rgb(var(--card))]
                     border-[rgb(var(--border))]
                     text-[rgb(var(--text))]"
        />
      </div>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border
                   bg-[rgb(var(--card))]
                   border-[rgb(var(--border))]
                   text-[rgb(var(--text))]"
      />

      <button className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
        Add Task
      </button>
    </form>
  );
}
