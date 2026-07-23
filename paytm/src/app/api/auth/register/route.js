import prisma from"@/lib/prisma.js";
import {generateToken} from "@/lib/jwt.js";
import {cookies} from "next/headers";
import bcrypt from "bcryptjs";
import { registerApiSchema } from "@/validations/authValidation";



export async function POST(req) {
    try{
    const cookieStore = await cookies();
    const body = await req.json();
    const validation = registerApiSchema.safeParse(body);

    if(!validation.success){
        return Response.json({
            success:false,
            errors:validation.error.issues
        } , {
            status:400
        })
    }

    const { name, email, password, phoneNumber } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
    where: {
        OR: [
            { email },
            { phoneNumber }
        ]
    }
});

if (existingUser) {
    if (existingUser.email === email) {
        return Response.json(
            {
                success: false,
                message: "Email already exists.",
            },
            {
                status: 409,
            }
        );
    }

    if (existingUser.phoneNumber === phoneNumber) {
        return Response.json(
            {
                success: false,
                message: "Phone number already exists.",
            },
            {
                status: 409,
            }
        );
    }
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
    const token = generateToken({  name: user.name,id: user.id, email: user.email });

    // Set the token as a cookie
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });

    return Response.json(
    {
        success: true,
        message: "Registration successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    },
    {
        status: 201,
    }
);

}catch (error) {
    console.error("Error during registration:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
    });
}
}
