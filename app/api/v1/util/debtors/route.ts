import debtorModel from "@/app/Models/debtorSchema";
import userModel from "@/app/Models/userSchema";
import { connectDB } from "@/app/lib/connect";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ALLOWEDORIGIN =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const { fullName, items, totalDebt, userId } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    if (!token) throw new Error("Please Login again");
    const { payload } = await jwtVerify(token as string, secret);
    if (payload.userId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!origin?.startsWith(ALLOWEDORIGIN))
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!fullName || !items || !userId)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    await connectDB();
    if (totalDebt > 0) {
      const debtor = new debtorModel({ fullName, totalDebt, items });
      await debtor.save();
      const user = await userModel.findByIdAndUpdate(userId, 
        {$push: {debtors: debtor._id}},
        {new:true}
      );
      return NextResponse.json(
        { success: true, message: "Debtor added successfully", debtorId: debtor._id},
        { status: 200 },
      );
    } else {
      const debtor = new debtorModel({ fullName, items });
      await debtor.save();
      const user = await userModel.findByIdAndUpdate(userId, 
        {$push: {debtors: debtor._id}},
        {new:true}
      );
      return NextResponse.json(
        { success: true, message: "Debtor added successfully", debtorId: debtor._id},
        { status: 200 },
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
