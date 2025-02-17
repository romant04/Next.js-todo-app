import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const todoList = await prisma.todoList.findFirst({
      where: { id: Number(data.listId) },
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

    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        content: data.content,
        dueDate: data.dueDate,
        priority: data.priority,
        listId: Number(data.listId),
      },
    });

    return NextResponse.json({ todo: todo }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const todoId = req.nextUrl.searchParams.get("todoId");
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!todoId) {
    return NextResponse.json(
      { message: "Todo ID is required" },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.findFirst({
    where: { id: Number(todoId) },
  });

  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  const todoList = await prisma.todoList.findFirst({
    where: { id: todo.listId },
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

  await prisma.todo.delete({ where: { id: Number(todoId) } });

  return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const todoId = req.nextUrl.searchParams.get("todoId");
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!todoId) {
    return NextResponse.json(
      { message: "Todo ID is required" },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.findFirst({
    where: { id: Number(todoId) },
  });

  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  const todoList = await prisma.todoList.findFirst({
    where: { id: todo.listId },
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

  return NextResponse.json({ todo: todo }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const userId = req.headers.get("x-user-id");
  const todoId = req.nextUrl.searchParams.get("todoId");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!todoId) {
    return NextResponse.json(
      { message: "Todo ID is required" },
      { status: 400 },
    );
  }

  const todo = await prisma.todo.findFirst({
    where: { id: Number(todoId) },
  });

  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  const todoList = await prisma.todoList.findFirst({
    where: { id: todo.listId },
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

  const updatedTodo = await prisma.todo.update({
    where: { id: Number(todoId) },
    data: {
      title: data.title,
      content: data.content,
      dueDate: data.dueDate,
      priority: data.priority,
      completed: data.completed,
    },
  });

  return NextResponse.json({ todo: updatedTodo }, { status: 200 });
}
