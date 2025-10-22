import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "seasonal";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
}

const THEME_STORAGE_KEY = "APP_THEME";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(systemTheme || "light");

  // Load saved theme from storage on mount
  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        setThemeState(storedTheme as Theme);
      }
    })();
  }, []);

  // Function to update theme and save it
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  const colors =
    theme === "light"
      ? {
          background: "#dee7e8ff", //f4f9f9ff
          accent: "#f4f9f9ff", //d3dddfff
          text: "#131313ff",
          tabBarActive: "#23a9edff",
          tabBarInactive: "gray",
          star: "#c8a30fff"
        }
      : theme === "dark"
      ? {
          background: "#121212ff", //#0c0c0cff
          accent: "#292e2eff", //#202424ff
          text: "#eff6f8ff",
          tabBarActive: "#23a9edff",
          tabBarInactive: "#777",
          star: "#c8a30fff"
        }
      : {
          background: "#1a100bff",
          accent: "#ff8c42",
          text: "#f1f5f6ff",
          tabBarActive: "#211302ff",
          tabBarInactive: "#522b12ff",
          star: "#c8a30fff"
        };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
