import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req) {
    console.log("Proxy is running");

    const token = req.cookies.get("token")?.value;

    //console.log("Token:", token);

    if (!token) {
        console.log("No token");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //console.log("Verified:", decoded);

        return NextResponse.next();
    } catch (err) {
        console.log("JWT Error:", err.message);

        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};