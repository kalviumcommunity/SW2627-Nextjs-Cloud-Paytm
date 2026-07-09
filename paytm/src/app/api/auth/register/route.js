import prisma from"@/lib/prisma.js";
import {generateToken} from "@/lib/jwt.js";
import {cookies} from "next/headers";
import bcrypt from "bcryptjs";



export async function POST(req) {
    try{
    const cookieStore = await cookies();
    const { name, email, password, phoneNumber } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return new Response(JSON.stringify({ error: "User already exists" }), {
            status: 400,
        });
    }

    // Create a new user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            phoneNumber , 
            password: hashedPassword //Note: In a real application, you should hash the password before storing it
        },
    });

    // Generate a token for the new user
    const token = generateToken({ id: user.id, email: user.email });

    // Set the token as a cookie
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });

    return new Response(JSON.stringify({ token }), {
        status: 201,
    });

}catch (error) {
    console.error("Error during registration:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
    });
}
}
