import { FC, useState } from "react";
import { TodoList } from "@/src/app/components/todo-list";
import { WhiteLoader } from "@/src/app/components/white-loader";
import Link from "next/link";
import { UserData } from "@/src/types/user";
import { TodoList as ITodoList } from ".prisma/client";
import { toast } from "react-toastify";
import { addTodoList } from "@/src/app/redux/slices/todolist-slice";
import { useDispatch } from "react-redux";

interface Props {
  user: UserData | null;
  todoLists: ITodoList[];
}

export const SidebarContent: FC<Props> = ({ user, todoLists }) => {
  const dispatch = useDispatch();
  const [addMode, setAddMode] = useState(false);
  const [title, setTitle] = useState("");
  const [addLoding, setAddLoading] = useState(false);

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

  return user ? (
    <>
      <div className="flex w-full flex-col items-center px-4 md:items-start">
        <h3 className="mt-2 text-2xl text-emerald-400">Todo lists</h3>
        {todoLists.length === 0 && (
          <div className="flex flex-col">
            <p>You have no todo lists yet</p>
          </div>
        )}
        <div className="flex w-4/5 flex-col">
          <div className="mt-3 flex flex-col gap-2">
            {todoLists.map((list) => (
              <TodoList key={list.title} title={list.title} />
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
                className="mt-2 rounded-sm bg-emerald-500 px-4 py-2 hover:bg-emerald-600"
                onClick={handleAddingTodoList}
              >
                {addLoding ? <WhiteLoader /> : "Add"}
              </button>
              <button
                className="mt-1 rounded-sm bg-red-500 px-4 py-2 hover:bg-red-600"
                onClick={() => setAddMode(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="mt-2 rounded-sm bg-emerald-500 px-4 py-2 hover:bg-emerald-600"
              onClick={() => setAddMode(true)}
            >
              Add todo list
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 md:mt-0">
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
  );
};
