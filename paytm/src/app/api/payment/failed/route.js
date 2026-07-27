import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { razorpay_order_id } = await req.json();

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
        status: "FAILED",
      },
    });

    return Response.json({
      success: true,
      message: "Payment marked as failed",
      recharge: updatedRecharge,
    });
  } catch (error) {
    console.error("Payment failure error:", error);

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