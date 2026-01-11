import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const login = async (provider) => {
    await signInWithPopup(auth, provider);
    setOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[rgb(var(--border))]">
      <h1 className="text-lg sm:text-xl font-bold">
        Todo<span className="text-blue-600">Flow</span>
      </h1>

      <div className="flex items-center gap-3 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-md text-sm border border-[rgb(var(--border))] hover:opacity-80"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {user ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-[rgb(var(--border))]"
              />
              <span className="text-sm font-medium">
                {user.displayName || "User"}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={() => signOut(auth)}>
              Logout
            </Button>
          </>
        ) : (
          <div className="relative">
            <Button onClick={() => setOpen((o) => !o)}>Login</Button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => login(googleProvider)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Google
                </button>
                <button
                  onClick={() => login(githubProvider)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  GitHub
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
