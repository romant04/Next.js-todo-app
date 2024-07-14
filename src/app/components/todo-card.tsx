import { FC, useState } from "react";
import { Todo } from ".prisma/client";
import { clsx } from "clsx";
import { FaPenSquare, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteTodo } from "@/src/app/redux/slices/todo-slice";
import { WhiteLoader } from "@/src/app/components/white-loader";
import Link from "next/link";
import { toast } from "react-toastify";

interface Props {
  todo: Todo;
}

export const TodoCard: FC<Props> = ({ todo }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setDeleteLoading(true);
    const res = await fetch(`/api/todo?todoId=${todo.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await res.json();

    setDeleteLoading(false);
    if (!res.ok) {
      toast.error(json.message);
      return;
    }

    dispatch(deleteTodo(todo.id));
  };

  return (
    <div
      className={clsx(
        "mt-4 flex w-full max-w-xs flex-col gap-4 rounded-sm px-5 py-3 text-white",
        todo.priority === 1 && "bg-emerald-700",
        todo.priority === 2 && "bg-yellow-600",
        todo.priority === 3 && "bg-red-800",
      )}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">{todo.title}</h3>
        <div className="flex gap-5">
          <Link href={{ pathname: "/editTodo", query: { todoId: todo.id } }}>
            <FaPenSquare
              size={20}
              className="cursor-pointer text-white hover:text-gray-200"
            />
          </Link>
          {deleteLoading ? (
            <WhiteLoader />
          ) : (
            <FaTrash
              size={20}
              className="cursor-pointer text-white hover:text-gray-200"
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
      <p className="h-28 overflow-auto font-light">{todo.content}</p>
      <span className="mt-auto text-sm text-gray-200">
        {new Date(todo.dueDate).toLocaleDateString()}
      </span>
    </div>
  );
};
