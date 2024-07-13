"use client";

import { Sidebar } from "@/src/app/components/sidebar/sidebar";
import { useAuth } from "@/src/hooks/useAuth";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/app/redux/store";
import Link from "next/link";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";

export default function Home() {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const { activeTodoList } = useSelector((state: RootState) => state.todoLists);

  if (loading)
    return (
      <div>
        <WhiteLoader />
      </div>
    );

  return (
    <div className="layout-home">
      <Sidebar />
      <div className="main dark:bg-gray-900 dark:text-white">
        {user ? (
          <>
            {activeTodoList ? (
              <div className="mx-10 mt-20 flex flex-col items-center md:mt-8">
                <h2 className="self-start text-2xl">{activeTodoList.title}</h2>
              </div>
            ) : (
              <div className="mt-20 flex flex-col items-center md:mt-8">
                <span>You need to add todo list to start adding todos</span>
                <button
                  className="mt-4 rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700 md:hidden"
                  onClick={() => dispatch(toggleSidebar(true))}
                >
                  Add todo list
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-20 flex flex-col items-center md:mt-8">
            <span>You need to be signed in to start adding todos</span>
            <Link href="/login">
              <button className="mt-4 rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700">
                Sign in
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
