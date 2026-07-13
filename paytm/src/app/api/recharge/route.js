import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { mobileNumber, operator, amount } = await req.json();

    // Authenticate user
    const user = await auth();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Validate request body
    if (!mobileNumber || !operator || !amount) {
      return Response.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate recharge within last 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

    const duplicateRecharge = await prisma.recharge.findFirst({
      where: {
        userId: user.id,
        mobileNumber,
        operator,
        amount,
        createdAt: {
          gte: tenSecondsAgo,
        },
      },
    });

    if (duplicateRecharge) {
      return Response.json(
        {
          success: false,
          message: "Duplicate recharge detected. Please wait 10 seconds.",
        },
        {
          status: 409,
        }
      );
    }

    // Generate transaction ID
    const transactionId =
      "TXN" + Date.now() + Math.floor(Math.random() * 10000);

    // Save recharge
    const recharge = await prisma.recharge.create({
      data: {
        userId: user.id,
        mobileNumber,
        operator,
        amount,
        transactionId,
        // status: "PENDING" // Optional, Prisma already defaults it
      },
    });

    return Response.json(
      {
        success: true,
        message: "Recharge initiated successfully.",
        recharge,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}