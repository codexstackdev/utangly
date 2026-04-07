import { connectDB } from "@/app/lib/connect";
import userModel from "@/app/Models/userSchema";
import bcrypt from "bcryptjs";
import { jwtDecrypt } from "jose";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ALLOWEDORIGIN = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export async function POST(req:NextRequest){
    const origin = req.headers.get("origin");
    const { email, password } = await req.json();
    try {
        if(!origin?.includes(ALLOWEDORIGIN)) return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        if(!email || !password) return NextResponse.json({success: false, message: "Invalid params"}, {status: 400});
        await connectDB();
        const user = await userModel.findOne({email:email});
        if(!user) return NextResponse.json({success: false, message: "User don't exist"}, {status: 400});
        const verifyPassword = await bcrypt.compare(password, user.password);
        if(!verifyPassword) return NextResponse.json({success: false, message: "Incorrect password"}, {status: 400});
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY as string, {expiresIn: "7D"});
        const response = NextResponse.json({success: true, message: "Logged in successfully", auth: user._id});
        response.cookies.set({
            name: "auth",
            value: token,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Unreachable";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}