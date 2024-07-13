import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const listId = req.nextUrl.searchParams.get("listId");
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!listId) {
    return NextResponse.json(
      { message: "List ID is required" },
      { status: 400 },
    );
  }

  const todoList = await prisma.todoList.findFirst({
    where: { id: Number(listId) },
  });

  if (!todoList) {
    return NextResponse.json(
      { message: "Todo list not found" },
      { status: 404 },
    );
  }

  if (todoList.userId !== Number(userId)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { listId: Number(listId) },
  });

  return NextResponse.json({ todos: todos }, { status: 200 });
}
