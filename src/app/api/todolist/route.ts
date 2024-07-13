import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const userId = req.headers.get("x-user-id");

  try {
    const todoList = await prisma.todoList.create({
      data: { title: data.title, userId: Number(userId) },
    });
    return NextResponse.json({ todoList: todoList }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const userId = req.headers.get("x-user-id");

  try {
    const todoList = await prisma.todoList.findUnique({
      where: { id: data.id },
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

    await prisma.todoList.delete({
      where: { id: data.id },
    });
    return NextResponse.json({ message: "Todo list deleted" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
