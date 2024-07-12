import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/jwtTokenControl";

export async function middleware(request: NextRequest) {
  const result = await isAuthenticated(request);

  if (!result) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", result);

  return response;
}

export const config = {
  matcher: "/api/todolist/:path*",
};
