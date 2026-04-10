import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const params = req.nextUrl.pathname;
  const id = params.split("/")[2];
  const token = req.cookies.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    if (!token) throw new Error("No token found");
    const { payload } = await jwtVerify(token as string, secret);
    if (payload.userId !== id) {
      const response = NextResponse.redirect(new URL("/unauthorized", req.url));
      response.cookies.delete("auth");
      return response;
    }
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("auth");
    return response;
  }
}

export const config = {
  matcher: ["/utangly/:id*"],
};
