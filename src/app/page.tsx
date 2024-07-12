"use client";

import { Sidebar } from "@/src/app/components/sidebar/sidebar";
import { useAuth } from "@/src/hooks/useAuth";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { useSelector } from "react-redux";
import { RootState } from "@/src/app/redux/store";

export default function Home() {
  const { user, loading } = useAuth();
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
              <div className="mt-6">
                <h2 className="text-2xl">{activeTodoList.title}</h2>
              </div>
            ) : (
              <span>You need to add todolist to start adding todos</span>
            )}
          </>
        ) : (
          <span>You need to be signed in to start adding todos</span>
        )}
      </div>
    </div>
  );
}
