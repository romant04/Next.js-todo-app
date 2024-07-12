import { FC } from "react";
import Link from "next/link";

export const Sidebar: FC = () => {
  return (
    <div className="side flex flex-col items-center justify-between bg-gray-600 dark:bg-gray-700">
      <div className="text-center">
        <h2 className="mt-4 text-xl">Not signed in</h2>
        <p className="mt-2 text-sm">Sign in to start adding your todos</p>
        <Link href="/login">
          <button className="mt-4 rounded-md bg-emerald-600 px-8 py-2 hover:bg-emerald-700">
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
};
