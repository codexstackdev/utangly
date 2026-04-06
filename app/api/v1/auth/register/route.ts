import { connectDB } from "@/app/lib/connect";
import userModel from "@/app/Models/userSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const ALLOWEDORIGIN = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function POST(req:NextRequest){
    const origin = req.headers.get("origin");
    const { fullName, email, password } = await req.json();
    try {
        if(!origin?.includes(ALLOWEDORIGIN)) return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        if(!fullName || !email || !password) return NextResponse.json({success: false, message: "Missing params"}, {status: 400});
        await connectDB();
        const emailExist = await userModel.findOne({email: email})
        if(emailExist) return NextResponse.json({success: false, message: "Email already used"}, {status: 400});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({fullName, email, password: hashedPassword});
        await user.save();
        return NextResponse.json({success: true, message: "Registered successfully"});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Unreachable";
        return NextResponse.json({success: false, message: err}, {status: 500})
    }
}