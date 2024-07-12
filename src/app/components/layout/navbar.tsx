import { FC } from "react";
import { ThemeSwitcher } from "@/src/app/components/layout/theme-switcher";

export const Navbar: FC = () => {
  return (
    <div className="header w-full bg-gray-800 text-white py-3 px-8 flex justify-between items-center">
      <h1 className="text-2xl">Todo app</h1>
      <ThemeSwitcher />
    </div>
  );
};
