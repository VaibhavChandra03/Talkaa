import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Talkaa-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Talkaa-theme", theme);
    set({ theme });
  },
}));
