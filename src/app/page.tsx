"use client";

import { Sidebar } from "@/src/app/components/sidebar/sidebar";

export default function Home() {
  return (
    <>
      <Sidebar />
      <div className="main">
        <h1>You need to be signed in to start adding todos</h1>
      </div>
    </>
  );
}
