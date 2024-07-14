"use client";

import { Sidebar } from "@/src/app/components/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { UserData } from "@/src/types/user";
import { RootState } from "@/src/app/redux/store";
import { fetchTodos, resetTodos } from "@/src/app/redux/slices/todo-slice";
import Link from "next/link";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { TodoCard } from "@/src/app/components/todo-card";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";
import { toast } from "react-toastify";
import { TodosFilter } from "@/src/app/components/todos-filter";

export default function Home() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [todosLoading, setTodosLoading] = useState(false);

  const { activeTodoList } = useSelector((state: RootState) => state.todoLists);
  const { todos } = useSelector((state: RootState) => state.todos);
  const { sortBy, filterBy } = useSelector(
    (state: RootState) => state.todoFilters,
  );

  useEffect(() => {
    const fetchServerTodos = async () => {
      const res = await fetch(`/api/todos?listId=${activeTodoList!.id}`, {
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
      dispatch(resetTodos());
      setTodosLoading(true);
      void fetchServerTodos();
    }
  }, [activeTodoList]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    const checkToken = async () => {
      const res = await fetch(`/api/auth/checkToken?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      setLoading(false);
      const valid = json.isValid;

      if (!valid) return;
      setUser({ ...json.user });
    };

    if (!token) {
      setLoading(false);
      return;
    }

    void checkToken();
  }, []);

  const sortedTodos = todos
    .filter((todo) => {
      if (filterBy === "all") return true;
      if (filterBy === "completed") return todo.completed;
      if (filterBy === "uncompleted") return !todo.completed;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return Number(new Date(a.dueDate)) < Number(new Date(b.dueDate))
          ? -1
          : 1;
      } else if (sortBy === "priority") {
        return a.priority < b.priority ? -1 : 1;
      } else {
        return 0;
      }
    });

  return (
    <div className="layout-home">
      <Sidebar user={user} loading={loading} />
      <div className="main dark:bg-gray-900 dark:text-white">
        {loading ? (
          <WhiteLoader />
        ) : user ? (
          <>
            {activeTodoList ? (
              <div className="mx-10 mt-20 flex flex-col items-center md:mt-8 lg:mx-auto lg:w-4/5">
                <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
                  <h2 className="text-2xl">{activeTodoList.title}</h2>
                  <Link
                    href={{
                      pathname: "/addTodo",
                      query: {
                        listId: activeTodoList.id,
                      },
                    }}
                  >
                    <button className="rounded-sm bg-emerald-600 px-8 py-2 text-white hover:bg-emerald-700">
                      Add todo
                    </button>
                  </Link>
                </div>
                <TodosFilter />
                <div className="mt-5 flex w-full flex-wrap justify-center gap-5 md:justify-start">
                  {todosLoading ? (
                    <WhiteLoader />
                  ) : (
                    <>
                      {sortedTodos.map((todo) => (
                        <TodoCard todo={todo} key={todo.id} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-20 flex flex-col items-center md:mt-8">
                <span className="text-center">
                  You need to add todo list to start adding todos
                </span>
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
            <span className="text-center">
              You need to be signed in to start adding todos
            </span>
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
