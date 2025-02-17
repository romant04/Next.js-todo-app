import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTodoList,
  setActiveTodoList,
} from "@/src/app/redux/slices/todolist-slice";
import { RootState } from "@/src/app/redux/store";
import { clsx } from "clsx";
import { FaTrash } from "react-icons/fa";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { toast } from "react-toastify";
import { toggleSidebar } from "@/src/app/redux/slices/sidebar-slice";

interface Props {
  title: string;
  id: number;
}

export const TodoList: FC<Props> = ({ title, id }) => {
  const dispatch = useDispatch();
  const { activeTodoList } = useSelector((state: RootState) => state.todoLists);
  const [loading, setLoading] = useState(false);

  const handleTodoListDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/todolist", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(json.message);
      return;
    }

    dispatch(deleteTodoList(id));
  };

  const handleSelectingTodoList = () => {
    dispatch(setActiveTodoList(id));
    dispatch(toggleSidebar(false));
  };

  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer items-center justify-between bg-gray-500 p-1 text-lg hover:bg-gray-700 dark:hover:bg-gray-600",
        activeTodoList?.id === id && "bg-gray-700 dark:bg-gray-600",
      )}
      onClick={handleSelectingTodoList}
    >
      <span>{title}</span>
      {loading ? (
        <WhiteLoader />
      ) : (
        <FaTrash
          size={20}
          className="cursor-pointer text-red-500 hover:text-red-600"
          onClick={handleTodoListDelete}
        />
      )}
    </div>
  );
};
