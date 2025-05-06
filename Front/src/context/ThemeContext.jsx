import React, { createContext, useState, useContext } from "react";

// ThemeContext létrehozása
const ThemeContext = createContext();

// ThemeProvider komponens
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Alapértelmezett téma: light

  // Téma váltó függvény
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook a téma használatához
export const useTheme = () => useContext(ThemeContext);