import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./lib/firebase";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import { useTodos } from "./hooks/useTodos";

export default function App() {
  const [user] = useAuthState(auth);
  const { todos, toggleComplete, removeTodo, updateTodo } =
    useTodos(user?.uid);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Analytics
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const completionPercent = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;

  const filtered = todos.filter((t) => {
    if (filter === "Completed" && !t.completed) return false;
    if (filter === "Pending" && t.completed) return false;
    if (!t.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {user ? (
        <div
          className="
            max-w-md mx-auto mt-6 p-5 rounded-2xl shadow
            bg-[rgb(var(--card))] text-[rgb(var(--text))]
          "
        >
          {/* Analytics */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Completed: {completedCount}</span>
              <span>Pending: {pendingCount}</span>
              <span>Total: {todos.length}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[rgb(var(--border))] overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              {completionPercent}% done
            </div>
          </div>

          <TodoForm />

          {/* Search */}
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full mt-4 px-3 py-2 rounded
              border
              bg-[rgb(var(--card))] text-[rgb(var(--text))]
              border-[rgb(var(--border))]
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          {/* Filters */}
          <div className="flex justify-between mt-3 text-sm">
            {["All", "Completed", "Pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded transition
                  ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-[rgb(var(--border))] text-[rgb(var(--text))]"
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-3">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleComplete}
                onDelete={removeTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-20 text-center text-lg font-medium text-gray-500 dark:text-gray-400">
          To use this tool, make sure you log in first.
        </div>
      )}
    </div>
  );
}
