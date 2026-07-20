import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma"; 
import { rechargeSchema } from "@/validations/rechargeValidation";


export async function POST(req) {
  try {
    const body = await req.json();

    const validation = rechargeSchema.safeParse(body);

    if(!validation.success){
      return Response.json({
        success:false ,
        errors:validation.error.issues

      },{
        status:400
      })
    }
    const { mobileNumber, operator, amount } = validation.data;

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

    setTimeout(async () => {
      try {

        const status = Math.random()<0.8 ? "SUCCESS" : "FAILED";

        await prisma.recharge.update({
          where:{
          id:recharge.id},
          data:{
          status}
        })
        console.log(`${recharge.id} updated status to ${status}`)
        
      } catch (error) {
        console.log(error)
        
      }

      
    }, 5000);

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


export async function GET(req){
  try {

    const user= await auth();
  const { searchParams } = new URL(req.url);
  const operator = searchParams.get("operator");
  const date = searchParams.get("date");
  

     if (!user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
    );}

    const where = {
    userId: user.id,
};

if (operator) {
    where.operator = operator;
}

if(date){
  const start = new Date(date);

  if (isNaN(start.getTime())) {
        return Response.json(
            {
                success: false,
                message: "Invalid date format",
            },
            {
                status: 400,
            }
        );
}
const end = new Date(date);
end.setDate(end.getDate() + 1);
where.createdAt = {
    gte: start,
    lt: end,
};

}
const recharges = await prisma.recharge.findMany({
    where,
    orderBy: {
        createdAt: "desc",
    },
});

return Response.json(
    {
        success: true,
        recharges,
    },
    {
        status: 200,
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




    







    
