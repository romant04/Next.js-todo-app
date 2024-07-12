import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
  if (!decoded) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }
  // @ts-ignore
  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    // @ts-ignore
    where: { email: decoded.email },
    include: { todoLists: true },
  });

  return NextResponse.json(
    // @ts-ignore
    { user: user, isValid: true },
    { status: 200 },
  );
}
