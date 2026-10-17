"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "addis-eats-theme";

export function ThemeProvider({ children }) {
  // Use the same initial theme on the server and first client render.
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Read the saved theme only after the initial render.
  useEffect(() => {
    let savedTheme = "light";

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved === "light" || saved === "dark") {
        savedTheme = saved;
      }
    } catch {
      // Storage may be unavailable.
    }

    setTheme(savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The theme still changes for this session.
      }

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      mounted,
    }),
    [theme, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}