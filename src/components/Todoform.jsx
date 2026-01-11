import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TodoForm() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !auth.currentUser) return;

    await addDoc(collection(db, "todos"), {
      text,
      completed: false,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
    });

    setText("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Task input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="
          w-full px-4 py-2 rounded-xl
          border border-gray-300
          bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
        "
      />

      <div className="flex gap-2">
        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="
            flex-1 px-3 py-2 rounded-lg
            border border-gray-300
            bg-white text-gray-900
            focus:outline-none
            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
          "
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Category */}
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="
            flex-1 px-3 py-2 rounded-lg
            border border-gray-300
            bg-white text-gray-900
            focus:outline-none
            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
          "
        />
      </div>

      {/* Due date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="
          w-full px-3 py-2 rounded-lg
          border border-gray-300
          bg-white text-gray-900
          focus:outline-none
          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
        "
      />

      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Add Task
      </button>
    </form>
  );
}
