"use client";

import { FC } from "react";
import { ThemeSwitcher } from "@/src/app/components/layout/theme-switcher";
import { GiHamburgerMenu } from "react-icons/gi";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/app/redux/store";

export const Navbar: FC = () => {
  const dispatch = useDispatch();

  const { open } = useSelector((state: RootState) => state.sidebar);

  return (
    <div className="header flex w-full items-center justify-between bg-gray-700 px-3 py-3 text-white dark:bg-gray-800 md:px-8">
      <div className="flex items-center gap-5">
        <GiHamburgerMenu
          size={28}
          className="cursor-pointer md:hidden"
          onClick={() => dispatch(toggleSidebar(!open))}
        />
        <h1 className="text-2xl">Todo app</h1>
      </div>
      <ThemeSwitcher />
    </div>
  );
};
