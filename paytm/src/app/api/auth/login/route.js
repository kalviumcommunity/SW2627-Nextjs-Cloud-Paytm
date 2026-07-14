import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";
import { loginSchema } from "@/validations/authValidation";

export async function POST(req) {
    try{
 const cookieStore = await cookies();
 const body = await req.json();

 const validation = loginSchema.safeParse(body);

 if(!validation.success){
    return Response.json({
        success:false,
        errors:validation.error.issues
    },{
        status:400
    })
 }


    const {
        email,
        password,
    } = validation.data;
   const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser){
        return Response.json(
            {
                success: false,
                message: "User not found",
            },
            {
                status: 404,
            }
        );
    }

    const isPasswordCorrect =
        await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
        return Response.json(
            {
                success: false,
                message: "Invalid Credentials",
            },
            {
                status: 401,
            }
        );
    }

    const token = generateToken({
        id: existingUser.id,
        email: existingUser.email,
    });

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
    });

    return Response.json({
        success: true,
        message: "Login Successful",
    });
}catch(error){
    console.error("Login error:", error);
    return Response.json(
        {
            success: false,
            message: "Internal Server Error",
        },
        {
            status: 500,
        }
    );
}}