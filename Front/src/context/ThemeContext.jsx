import React, { createContext, useState, useContext } from "react";

// Téma kezelő kontextus
export const ThemeContext = createContext(null);

// Téma hook
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Téma szolgáltató komponens
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Téma váltás
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}