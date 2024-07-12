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
