import { NextRequest } from "next/server";
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
    return new Response(
      JSON.stringify({
        status: 409,
        message: "User with this email is already in the database",
      }),
    );
  }

  if (userData.password !== userData.passwordConfirmation) {
    return new Response(
      JSON.stringify({ status: 409, message: "Passwords do not match" }),
    );
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const createdUser = await prisma.user.create({
    data: { email: userData.email, password: encryptedPassword },
  });

  const jwtToken = jwt.sign(
    { id: createdUser.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1 day",
    },
  );

  return Response.json({ token: jwtToken });
}
