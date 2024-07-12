import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { LoginData } from "@/src/types/user";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const userData: LoginData = await req.json();

  const user = await prisma.user.findFirst({
    where: { email: userData.email },
  });

  if (!user) {
    return {
      status: 400,
      json: { error: "User not found" },
    };
  }

  const passwordMatch = await bcrypt.compare(userData.password, user.password);

  if (!passwordMatch) {
    return {
      status: 400,
      json: { error: "Wrong password" },
    };
  }

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1 day",
  });

  return Response.json({ token: jwtToken });
}
