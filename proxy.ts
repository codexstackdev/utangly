import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function proxy(req:NextRequest){
    const params = req.nextUrl.pathname;
    const id = params.split("/")[2];
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    try {
        if(!token) throw new Error("No token found");
        const { payload } = await jwtVerify(token as string, secret);
        if(payload.userId !== id) {
            cookieStore.delete("auth");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        cookieStore.delete("auth");
        return NextResponse.redirect(new URL("/", req.url));
    }
}


export const config = {
    matcher: ["/utangly/:id*"]
}