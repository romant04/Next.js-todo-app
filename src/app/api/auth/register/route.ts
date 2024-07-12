import { NextRequest, NextResponse } from "next/server";
import { RegisterData } from "@/src/types/user";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<void | Response> {
  const userData: RegisterData = await req.json();

  const user = await prisma.user.findFirst({
    where: { email: userData.email },
  });

  if (user) {
    return NextResponse.json(
      { message: "User with this email already exists" },
      { status: 409 },
    );
  }

  if (userData.password !== userData.passwordConfirmation) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 409 },
    );
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const createdUser = await prisma.user.create({
    data: { email: userData.email, password: encryptedPassword },
  });

  const jwtToken = jwt.sign(
    { id: createdUser.id, email: createdUser.email, todoLists: [] },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1 day",
    },
  );

  return NextResponse.json({ token: jwtToken }, { status: 200 });
}
