import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { LoginData } from "@/src/types/user";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest): Promise<void | Response> {
  const userData: LoginData = await req.json();

  const user = await prisma.user.findFirst({
    where: { email: userData.email },
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "User with this email was not found",
      }),
    );
  }

  const passwordMatch = await bcrypt.compare(userData.password, user.password);

  if (!passwordMatch) {
    return new Response(
      JSON.stringify({ status: 400, message: "Wrong password" }),
    );
  }

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1 day",
  });

  return Response.json({ token: jwtToken });
}
