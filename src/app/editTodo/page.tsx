"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { useDispatch } from "react-redux";
import { editTodo } from "@/src/app/redux/slices/todo-slice";
import { TodoForm } from "@/src/app/components/todo-form";
import { TodoFormData } from "@/src/types/todo";

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setValue,
  } = useForm<TodoFormData>();

  const dispatch = useDispatch();
  const todoId = useSearchParams().get("todoId");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [listId, setListId] = useState<number | null>(null);

  const handleEditTodo = async (data: TodoFormData) => {
    setLoading(true);
    const res = await fetch(`/api/todo?todoId=${todoId}`, {
      method: "PUT",
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

    dispatch(editTodo(json.todo));
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/todo?todoId=${todoId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();

      setFetchLoading(false);
      if (!res.ok) {
        console.error(json.message);
        return;
      }

      setValue(
        "dueDate",
        new Date(json.todo.dueDate).toISOString().split("T")[0],
      );
      setValue("title", json.todo.title);
      setValue("content", json.todo.content);
      setValue("priority", json.todo.priority);
      setListId(json.todo.listId);
    };

    if (todoId) {
      setFetchLoading(true);
      void fetchData();
    }
  }, [todoId]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {fetchLoading ? (
        <WhiteLoader />
      ) : (
        <>
          <div className="flex w-full items-center justify-between px-10 lg:w-2/5">
            <Link href="/">
              <FaArrowLeft
                size={24}
                className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
              />
            </Link>
            <h1 className="text-4xl">Edit todo</h1>
            <span></span>
          </div>
          <TodoForm
            control={control}
            register={register}
            handleSubmit={handleSubmit}
            handleAddEdit={handleEditTodo}
            errors={errors}
            loading={loading}
            edit={true}
          />
        </>
      )}
    </div>
  );
}
