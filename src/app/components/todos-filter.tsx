import { ChangeEvent, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Filters,
  setFilter,
  setSorter,
  Sorters,
} from "@/src/app/redux/slices/todo-filters-slice";
import { RootState } from "@/src/app/redux/store";

export const TodosFilter: FC = () => {
  const dispatch = useDispatch();

  const { sortBy, filterBy } = useSelector(
    (state: RootState) => state.todoFilters,
  );

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSorter(e.target.value as Sorters));
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter(e.target.value as Filters));
  };

  return (
    <div className="mt-5 flex w-full gap-5">
      <div>
        <span>Sort by: </span>
        <select
          className="rounded-sm bg-gray-500 p-1 text-lg text-white dark:bg-gray-200 dark:text-black"
          onChange={handleSortChange}
          defaultValue={sortBy}
        >
          <option value="">-</option>
          <option value="priority">Priority</option>
          <option value="date">Date</option>
        </select>
      </div>
      <div>
        <span>Filter: </span>
        <select
          className="rounded-sm bg-gray-500 p-1 text-lg text-white dark:bg-gray-200 dark:text-black"
          onChange={handleFilterChange}
          defaultValue={filterBy}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </div>
    </div>
  );
};
