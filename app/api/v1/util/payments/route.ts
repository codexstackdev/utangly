import { connectDB } from "@/app/lib/connect";
import debtorModel from "@/app/Models/debtorSchema";
import historyModel from "@/app/Models/historySchema";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ALLOWEDORIGIN =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const { payBy, amount, totalDebt, userId, debtorId } = await req.json();
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
      await connectDB();
      const isPaid = (amount - totalDebt) === 0 ? "paid" : "not paid";
      const debtor = await debtorModel.findByIdAndUpdate(debtorId, 
        {$inc: {totalDebt: - amount}},
        {returnDocument: "after"}
      );
      const updateDebtorStatus = await debtorModel.findByIdAndUpdate(debtorId, {
        $set: {status: isPaid}
      },{returnDocument: "after"});
      if(!debtor || !updateDebtorStatus) return NextResponse.json({success: false, message: "Something went wrong"}, {status: 400});
    const history = new historyModel({payBy, amountPaid:amount, issuedBy:userId});
    await history.save();
    const savetoDebtorHistory = await debtorModel.findByIdAndUpdate(debtorId, {
      $push: {history: history._id}
    }, {returnDocument: "after"});
    if(!savetoDebtorHistory) return NextResponse.json({success: false, message: "Something went wrong"}, {status: 400});
    return NextResponse.json({success: true, message: "Transaction Completed Successfully." });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
