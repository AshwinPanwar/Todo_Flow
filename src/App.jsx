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
          className="max-w-md mx-auto mt-6 p-5 rounded-2xl shadow
                     bg-white text-gray-900
                     dark:bg-gray-900 dark:text-gray-100"
        >
          <TodoForm />

          {/* Search */}
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full mt-4 px-3 py-2 rounded
              border border-gray-300
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
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
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
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
        <div className="mt-20 text-center text-lg font-medium text-gray-500 dark:text-red-500">
         To use this tool, make sure you log in first.
       </div>

      )}
    </div>
  );
}
