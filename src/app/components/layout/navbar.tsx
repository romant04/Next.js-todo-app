"use client";

import { FC } from "react";
import { ThemeSwitcher } from "@/src/app/components/layout/theme-switcher";

export const Navbar: FC = () => {
  return (
    <div className="header flex w-full items-center justify-between bg-gray-700 px-3 py-3 text-white dark:bg-gray-800 md:px-8">
      <h1 className="text-2xl">Todo app</h1>
      <ThemeSwitcher />
    </div>
  );
};
