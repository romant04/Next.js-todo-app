"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { InputField } from "@/src/app/components/input-field";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addTodo } from "@/src/app/redux/slices/todo-slice";

interface FormData {
  title: string;
  content: string;
  dueDate: Date;
  priority: number;
}

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      dueDate: new Date(),
      priority: 1,
    },
  });

  const dispatch = useDispatch();
  const listId = useSearchParams().get("listId");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ ...data, listId: listId }),
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

    dispatch(addTodo(json.todo));
    router.push("/");
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between px-10 lg:w-2/5">
        <Link href="/">
          <FaArrowLeft
            size={24}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
          />
        </Link>
        <h1 className="text-4xl">Add todo</h1>
        <span></span>
      </div>
      <form
        onSubmit={handleSubmit((data) => handleAddTodo(data))}
        className="mt-4 flex w-full flex-col gap-4 px-10 lg:w-2/5"
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
          <span className="text-sm text-red-500">
            {errors.priority?.message}
          </span>
        </div>

        <div className="flex flex-col">
          <label>Due date</label>
          <input
            {...register("dueDate", {
              required: "Due date is required",
              valueAsDate: true,
            })}
            type="datetime-local"
            name="dueDate"
            className="rounded-sm bg-gray-500 p-1 text-lg text-white [color-scheme:dark] dark:bg-gray-200 dark:text-black dark:[color-scheme:light]"
          />
          <span className="text-sm text-red-500">
            {errors.dueDate?.message}
          </span>
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
          <span className="text-sm text-red-500">
            {errors.content?.message}
          </span>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-sm bg-emerald-500 py-3 text-xl hover:bg-emerald-600"
        >
          {loading ? <WhiteLoader /> : "Add todo"}
        </button>
      </form>
    </div>
  );
}
