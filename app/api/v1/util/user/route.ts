import { connectDB } from "@/app/lib/connect";
import userModel from "@/app/Models/userSchema";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import "@/app/Models/itemSchema";
import "@/app/Models/debtorSchema";
import "@/app/Models/historySchema";

const ALLOWEDORIGIN =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const userId = params.get("id");
  const auth = await cookies();
  const token = auth.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const origin = req.headers.get("referer");
  try {
    if (!origin?.startsWith(ALLOWEDORIGIN))
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 },
      );
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    const { payload } = await jwtVerify(token as string, secret);
    if (payload.userId !== userId)
      return NextResponse.json(
        { success: false, message: "Mango mango simo nga gago ka" },
        { status: 401 },
      );
    await connectDB();
    const user = await userModel
      .findById(userId)
      .select("-password -email")
      .populate("items", "itemName quantity price createdAt")
      .populate({
        path: "debtors",
        select: "fullName totalDebt items _id status history createdAt",
        populate: {
          path: "history",
          select: "payBy amountPaid createdAt",
          model: "historys",
        },
      });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
