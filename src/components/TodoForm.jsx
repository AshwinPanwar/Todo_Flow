import { useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function TodoForm() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !auth.currentUser) return;
    setIsSubmitting(true);
    setError("");

    try {
      if (!text.trim()) return;

      const normalized = text.trim().toLowerCase();

      const q = query(
        collection(db, "todos"),
        where("uid", "==", auth.currentUser.uid),
        where("normalizedText", "==", normalized)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        setError("This task already exists");
        return;
      }

      await addDoc(collection(db, "todos"), {
        text,
        normalizedText: normalized,
        completed: false,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: serverTimestamp(),
        uid: auth.currentUser.uid,
      });

      setText("");
      setDueDate("");
    } finally {
      setIsSubmitting(false);
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

      <button
        disabled={isSubmitting}
        className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
