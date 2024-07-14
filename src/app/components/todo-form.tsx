import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { InputField } from "@/src/app/components/input-field";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { TodoFormData } from "@/src/types/todo";

interface Props {
  control: any;
  register: any;
  handleSubmit: any;
  handleAddEdit: (data: TodoFormData) => Promise<void>;
  errors: any;
  loading: boolean;
  edit: boolean;
}

export const TodoForm: FC<Props> = ({
  control,
  handleAddEdit,
  handleSubmit,
  edit,
  errors,
  loading,
  register,
}) => {
  return (
    <form
      onSubmit={handleSubmit((data: TodoFormData) => handleAddEdit(data))}
      className="mt-4 flex w-full flex-col gap-4 px-5 md:px-10 lg:w-2/5"
    >
      <div>
        <Controller
          rules={{
            required: "Title is required",
            maxLength: {
              value: 20,
              message: "Title can be at most 20 characters long",
            },
          }}
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return <InputField {...field} type="text" label="Title" />;
          }}
        />
        <span className="text-sm text-red-500">{errors.title?.message}</span>
      </div>

      <div className="flex flex-col">
        <label>Priority</label>
        <select
          {...register("priority", {
            valueAsNumber: true,
            required: "Priority is required",
          })}
          name="priority"
          className="rounded-sm bg-gray-500 p-1 text-lg text-white dark:bg-gray-200 dark:text-black"
        >
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>
        <span className="text-sm text-red-500">{errors.priority?.message}</span>
      </div>

      <div className="flex flex-col">
        <label>Due date</label>
        <Controller
          control={control}
          rules={{ required: "Due date is required" }}
          name="dueDate"
          render={({ field: { name, onChange, value, ref } }) => (
            <input
              name={name}
              type="date"
              onChange={onChange}
              ref={ref}
              className="rounded-sm bg-gray-500 p-1 text-lg text-white [color-scheme:dark] dark:bg-gray-200 dark:text-black dark:[color-scheme:light]"
              value={value ? new Date(value).toISOString().split("T")[0] : ""}
            />
          )}
        />
        <span className="text-sm text-red-500">{errors.dueDate?.message}</span>
      </div>

      <div className="flex flex-col">
        <label>Content</label>
        <textarea
          {...register("content", {
            required: "Content is required",
            maxLength: {
              value: 400,
              message: "Content can be at most 400 characters long",
            },
          })}
          name="content"
          rows={4}
          className="rounded-sm bg-gray-500 p-1 text-lg text-white dark:bg-gray-200 dark:text-black"
        />
        <span className="text-sm text-red-500">{errors.content?.message}</span>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-sm bg-emerald-500 py-3 text-xl hover:bg-emerald-600"
      >
        {loading ? <WhiteLoader /> : edit ? "Edit todo" : "Add todo"}
      </button>
    </form>
  );
};
