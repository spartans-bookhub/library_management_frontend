import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  // check if user has dark mode preference or saved setting
  const storedMode = localStorage.getItem("themeMode");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [mode, setMode] = useState(storedMode || (prefersDark ? "dark" : "light"));

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: { default: "#121212", paper: "#1E1E1E" },
                primary: { main: "#90caf9" },
                secondary: { main: "#f48fb1" },
              }
            : {
                background: { default: "#fafafa", paper: "#fff" },
                primary: { main: "#42a5f5" },
                secondary: { main: "#9c27b0" },
              }),
        },
      }),
    [mode]
  );

  const value = { mode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};