"use client";

import { Sidebar } from "@/src/app/components/sidebar/sidebar";
import { useAuth } from "@/src/hooks/useAuth";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/app/redux/store";
import Link from "next/link";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchTodos } from "@/src/app/redux/slices/todo-slice";
import { TodoCard } from "@/src/app/components/todo-card";

export default function Home() {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const [todosLoading, setTodosLoading] = useState(false);

  const { activeTodoList } = useSelector((state: RootState) => state.todoLists);
  const { todos } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    const fetchServerTodos = async () => {
      const res = await fetch(`/api/todo?listId=${activeTodoList!.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();

      setTodosLoading(false);

      if (!res.ok) {
        toast.error(json.message);
        return;
      }

      dispatch(fetchTodos(json.todos));
    };

    if (activeTodoList) {
      setTodosLoading(true);
      void fetchServerTodos();
    }
  }, [activeTodoList]);

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
              <div className="mx-10 mt-20 flex flex-col items-center md:mt-8 lg:mx-auto lg:w-4/5">
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-2xl">{activeTodoList.title}</h2>
                  <Link
                    href={{
                      pathname: "/addTodo",
                      query: {
                        listId: activeTodoList.id,
                      },
                    }}
                  >
                    <button className="rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700">
                      Add todo
                    </button>
                  </Link>
                </div>
                <div className="mt-5 flex w-full flex-wrap gap-5">
                  {todosLoading ? (
                    <WhiteLoader />
                  ) : (
                    <>
                      {todos.map((todo) => (
                        <TodoCard todo={todo} key={todo.id} />
                      ))}
                    </>
                  )}
                </div>
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
