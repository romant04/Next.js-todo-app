import { FC } from "react";
import { Todo } from ".prisma/client";
import { clsx } from "clsx";

interface Props {
  todo: Todo;
}

export const TodoCard: FC<Props> = ({ todo }) => {
  return (
    <div
      className={clsx(
        "mt-4 flex w-full max-w-xs flex-col gap-4 rounded-sm px-8 py-3 text-white",
        todo.priority === 1 && "bg-emerald-700",
        todo.priority === 2 && "bg-yellow-700",
        todo.priority === 3 && "bg-red-700",
      )}
    >
      <h3 className="text-xl font-semibold">{todo.title}</h3>
      <p className="h-28 overflow-auto font-light">{todo.content}</p>
      <span className="mt-auto text-sm text-gray-200">
        {new Date(todo.dueDate).toLocaleDateString()}
      </span>
    </div>
  );
};
