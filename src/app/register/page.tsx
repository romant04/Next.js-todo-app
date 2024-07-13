"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { InputField } from "@/src/app/components/input-field";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WhiteLoader } from "@/src/app/components/white-loader";

interface FormData {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function Page() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
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
      console.error(json.message);
      return;
    }

    console.log("You have successfully registered!");
    localStorage.setItem("token", json.token);
    router.push("/");
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-2/5 items-center justify-between">
        <Link href="/">
          <FaArrowLeft
            size={24}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
          />
        </Link>
        <h1 className="text-4xl">Sign up</h1>
        <span></span>
      </div>
      <form
        onSubmit={handleSubmit((data) => handleRegister(data))}
        className="mt-4 flex w-2/5 flex-col gap-4"
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

        <div>
          <Controller
            rules={{
              required: "Password confirmation is required",
              validate: (value) =>
                value === getValues("password") || "The passwords do not match",
            }}
            name="passwordConfirmation"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <InputField
                  {...field}
                  type="password"
                  label="Password confirmation"
                />
              );
            }}
          />
          <span className="text-sm text-red-500">
            {errors.passwordConfirmation?.message}
          </span>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-sm bg-emerald-500 py-3 text-xl hover:bg-emerald-600"
        >
          {loading ? <WhiteLoader /> : "Register"}
        </button>
      </form>
      <p className="mt-5">
        If you already have an account, you can sign in{" "}
        <Link
          className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          href="/login"
        >
          here.
        </Link>
      </p>
    </div>
  );
}
