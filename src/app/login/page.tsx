"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { InputField } from "@/src/app/components/input-field";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WhiteLoader } from "@/src/app/components/white-loader";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    setLoading(false);
    if (!res.ok) {
      control._reset();
      toast.error(json.message);
      return;
    }

    toast.success("You have successfully signed in!");
    localStorage.setItem("token", json.token);
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
        <h1 className="text-4xl">Sign in</h1>
        <span></span>
      </div>
      <form
        onSubmit={handleSubmit((data) => handleLogin(data))}
        className="mt-4 flex w-full flex-col gap-4 px-10 lg:w-2/5"
      >
        <div>
          <Controller
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return <InputField {...field} type="email" label="Email" />;
            }}
          />
          <span className="text-sm text-red-500">{errors.email?.message}</span>
        </div>

        <div>
          <Controller
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return <InputField {...field} type="password" label="Password" />;
            }}
          />
          <span className="text-sm text-red-500">
            {errors.password?.message}
          </span>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-sm bg-emerald-500 py-3 text-xl hover:bg-emerald-600"
        >
          {loading ? <WhiteLoader /> : "Login"}
        </button>
      </form>
      <p className="mx-5 mt-5 text-center">
        If you do not have account yet, you can create one{" "}
        <Link
          className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          href="/register"
        >
          here.
        </Link>
      </p>
    </div>
  );
}
