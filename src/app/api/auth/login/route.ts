import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LoginData } from "@/src/types/user";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest): Promise<void | Response> {
  const userData: LoginData = await req.json();

  const user = await prisma.user.findFirst({
    where: { email: userData.email },
    include: { todoLists: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User with this email was not found" },
      { status: 409 },
    );
  }

  const passwordMatch = await bcrypt.compare(userData.password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 409 });
  }

  const jwtToken = jwt.sign(
    { id: user.id, email: user.email, todoLists: user.todoLists },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1 day",
    },
  );

  return NextResponse.json({ token: jwtToken }, { status: 200 });
}
