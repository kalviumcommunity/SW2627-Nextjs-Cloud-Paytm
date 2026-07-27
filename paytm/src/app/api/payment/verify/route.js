import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const generated = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

      

    
    if (generated !== razorpay_signature) {
      return Response.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        {
          status: 400,
        }
      );
    }

   
    const recharge = await prisma.recharge.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
    });

    if (!recharge) {
      return Response.json(
        {
          success: false,
          message: "Recharge not found",
        },
        {
          status: 404,
        }
      );
    }

    
    const updatedRecharge = await prisma.recharge.update({
      where: {
        id: recharge.id,
      },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "SUCCESS",
      },
    });

    return Response.json({
      success: true,
      message: "Payment verified successfully",
      recharge: updatedRecharge,
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}