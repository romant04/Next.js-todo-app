"use client";

import { FC, useEffect } from "react";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoList } from "@/src/app/redux/slices/todolist-slice";
import { RootState } from "@/src/app/redux/store";
import { GiHamburgerMenu } from "react-icons/gi";
import { clsx } from "clsx";
import { SidebarContent } from "@/src/app/components/sidebar/sidebar-content";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";
import { UserData } from "@/src/types/user";

interface Props {
  user: UserData | null;
  loading: boolean;
}

export const Sidebar: FC<Props> = ({ user, loading }) => {
  const dispatch = useDispatch();

  const { todoLists } = useSelector((state: RootState) => state.todoLists);
  const { open } = useSelector((state: RootState) => state.sidebar);

  useEffect(() => {
    if (!user) return;
    if (user?.todoLists.length === 0) return;

    dispatch(fetchTodoList(user.todoLists));
  }, [user]);

  if (loading)
    return (
      <div className="side flex flex-col items-center justify-center bg-gray-600 text-white dark:bg-gray-700">
        <WhiteLoader />
      </div>
    );

  return (
    <>
      <div className="md:hidden">
        <GiHamburgerMenu
          size={32}
          className="absolute left-10 top-24 z-20 cursor-pointer"
          onClick={() => dispatch(toggleSidebar(!open))}
        />
        <div
          className={clsx(
            "absolute h-full bg-gray-600 pb-8 pt-5 text-white transition-all duration-300 ease-out dark:bg-gray-700",
            open ? "w-full" : "w-0",
          )}
        >
          <div
            className={clsx(
              !open && "hidden",
              "flex h-[90%] flex-col items-center justify-between pt-12",
            )}
          >
            <SidebarContent user={user} todoLists={todoLists} />
          </div>
        </div>
      </div>

      <div className="side hidden flex-col items-center justify-between bg-gray-600 pb-8 pt-5 text-white dark:bg-gray-700 md:flex">
        <SidebarContent user={user} todoLists={todoLists} />
      </div>
    </>
  );
};
