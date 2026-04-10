import { connectDB } from "@/app/lib/connect";
import itemModel from "@/app/Models/itemSchema";
import userModel from "@/app/Models/userSchema";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ALLOWEDORIGIN =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const { item, qty, price, userId } = await req.json();
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
    if (!item || !price)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    await connectDB();
    const newItem = new itemModel({ itemName: item, quantity: qty, price });
    await newItem.save();
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { items: newItem._id },
      },
      { new: true },
    );
    return NextResponse.json(
      { success: true, message: "Item added successfully" },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get("origin");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const params = req.nextUrl.searchParams;
  const itemId = params.get("id");
  const userId = params.get("userId");
  try {
    if (!token) throw new Error("Please Login again");
    if (!origin?.startsWith(ALLOWEDORIGIN))
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!itemId || !userId)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    const { payload } = await jwtVerify(token as string, secret);
    if (payload.userId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    await connectDB();
    const item = await itemModel.findByIdAndDelete(itemId);
    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const origin = req.headers.get("origin");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const { price, quantity, itemId, userId } = await req.json();
  try {
    if (!origin?.startsWith(ALLOWEDORIGIN))
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 },
      );
    if (!token) throw new Error("Please login again");
    if(quantity < 0) throw new Error("Negative number isn't allowed");
    if (!price || !itemId || !userId)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    const { payload } = await jwtVerify(token as string, secret);
    if (payload.userId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
      await connectDB();
      const item = await itemModel.findByIdAndUpdate(itemId, 
        {$set: {price: price, quantity: quantity}},
        {new:true}
      );
      return NextResponse.json({success: true, message: "Item updated successfully"});
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
