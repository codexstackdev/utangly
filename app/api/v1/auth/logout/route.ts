import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });
    response.cookies.set({
      name: "auth",
      value: "",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server unreachable";
    return NextResponse.json({success: false, message: err}, {status: 500})
  }
}
