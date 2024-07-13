"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "@/src/app/redux/slices/todo-slice";
import { TodoForm } from "@/src/app/components/todo-form";
import { TodoFormData } from "@/src/types/todo";

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm<TodoFormData>({
    defaultValues: {
      title: "",
      content: "",
      dueDate: new Date().toLocaleDateString(),
      priority: 1,
    },
  });

  const dispatch = useDispatch();
  const listId = useSearchParams().get("listId");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (data: TodoFormData) => {
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
      console.error(json.message);
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
      <TodoForm
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        handleAddEdit={handleAddTodo}
        errors={errors}
        loading={loading}
        edit={false}
      />
    </div>
  );
}
