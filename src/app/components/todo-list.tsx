import { FC } from "react";

interface Props {
  title: string;
}

export const TodoList: FC<Props> = ({ title }) => {
  return (
    <div className="w-full cursor-pointer bg-gray-500 p-1 text-lg hover:bg-gray-600">
      {title}
    </div>
  );
};
