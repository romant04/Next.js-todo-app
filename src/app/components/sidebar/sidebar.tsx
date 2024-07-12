"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodoList,
  fetchTodoList,
} from "@/src/app/redux/slices/todolist-slice";
import { RootState } from "@/src/app/redux/store";
import { TodoList } from "@/src/app/components/todo-list";
import { useMediaQuery } from "@uidotdev/usehooks";
import { GiHamburgerMenu } from "react-icons/gi";
import { clsx } from "clsx";

export const Sidebar: FC = () => {
  const { user, loading } = useAuth();
  const [addMode, setAddMode] = useState(false);
  const [title, setTitle] = useState("");
  const [addLoding, setAddLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const { todoLists } = useSelector((state: RootState) => state.todoLists);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleAddingTodoList = async () => {
    setAddLoading(true);
    if (!title) {
      toast.error("Title is required");
      return;
    }
    const res = await fetch("/api/todolist", {
      method: "POST",
      body: JSON.stringify({ title: title }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.message);
      return;
    }

    dispatch(addTodoList(json.todoList));
    setAddLoading(false);
    setAddMode(false);
  };

  useEffect(() => {
    if (!user) return;
    if (user?.todoLists.length === 0) return;

    dispatch(fetchTodoList(user.todoLists));
  }, [user]);

  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  if (loading)
    return (
      <div className="side flex flex-col items-center justify-center bg-gray-600 text-white dark:bg-gray-700">
        <WhiteLoader />
      </div>
    );

  return (
    <>
      {isSmallDevice ? (
        <>
          <GiHamburgerMenu
            size={32}
            className="absolute left-10 top-24 z-20 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          <div
            className={clsx(
              "absolute flex h-full flex-col items-center justify-between bg-gray-600 pb-8 pt-5 text-white transition-all duration-300 ease-out dark:bg-gray-700",
              showMenu ? "w-full" : "w-0",
            )}
          >
            <div className={clsx(!showMenu && "hidden")}>
              {user ? (
                <>
                  <div className="w-full px-4">
                    <h3 className="mt-2 text-2xl text-emerald-400">
                      Todo lists
                    </h3>
                    {todoLists.length === 0 && (
                      <div className="flex flex-col">
                        <p>You have no todo lists yet</p>
                      </div>
                    )}
                    <div>
                      <div className="mt-3 flex flex-col gap-2">
                        {todoLists.map((list) => (
                          <TodoList title={list.title} />
                        ))}
                      </div>

                      {addMode ? (
                        <div className="mt-4 flex flex-col">
                          <label className="text-sm">Title</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-sm bg-gray-200 p-1 text-black dark:bg-gray-300"
                          />
                          <button
                            className="mt-1 rounded-sm bg-emerald-500 px-4 py-2"
                            onClick={handleAddingTodoList}
                          >
                            {addLoding ? <WhiteLoader /> : "Add"}
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mt-2 bg-emerald-500 px-4 py-2"
                          onClick={() => setAddMode(true)}
                        >
                          Add todo list
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <h2 className="text-lg">{user.email}</h2>
                    <button
                      className="rounded-sm bg-red-600 px-6 py-2 hover:bg-red-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl">Not signed in</h2>
                  <p className="mt-2 text-sm">
                    Sign in to start adding your todos
                  </p>
                  <Link href="/login">
                    <button className="mt-4 rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="side flex flex-col items-center justify-between bg-gray-600 pb-8 pt-5 text-white dark:bg-gray-700">
          {user ? (
            <>
              <div className="w-full px-4">
                <h3 className="mt-2 text-2xl text-emerald-400">Todo lists</h3>
                {todoLists.length === 0 && (
                  <div className="flex flex-col">
                    <p>You have no todo lists yet</p>
                  </div>
                )}
                <div>
                  <div className="mt-3 flex flex-col gap-2">
                    {todoLists.map((list) => (
                      <TodoList title={list.title} />
                    ))}
                  </div>

                  {addMode ? (
                    <div className="mt-4 flex flex-col">
                      <label className="text-sm">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-sm bg-gray-200 p-1 text-black dark:bg-gray-300"
                      />
                      <button
                        className="mt-1 rounded-sm bg-emerald-500 px-4 py-2"
                        onClick={handleAddingTodoList}
                      >
                        {addLoding ? <WhiteLoader /> : "Add"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="mt-2 bg-emerald-500 px-4 py-2"
                      onClick={() => setAddMode(true)}
                    >
                      Add todo list
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-5">
                <h2 className="text-lg">{user.email}</h2>
                <button
                  className="rounded-sm bg-red-600 px-6 py-2 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl">Not signed in</h2>
              <p className="mt-2 text-sm">Sign in to start adding your todos</p>
              <Link href="/login">
                <button className="mt-4 rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700">
                  Sign in
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};
