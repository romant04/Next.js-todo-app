"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="w-20 cursor-pointer rounded-full p-3 text-sm text-gray-100 hover:text-gray-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? <FaMoon size={26} /> : <FaSun size={26} />}
    </button>
  );
};
