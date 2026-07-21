import { z } from "zod";

export const rechargeSchema = z.object({
  mobileNumber: z
    .string()
    .refine((value)=> value.length>0 , {
      message:"Mobile number is required"
    }) 
    .refine((value)=> /^\d{10}$/.test(value), {
      message:
        "Mobile number must be exactly 10 digits."
      }
     )
    ,

 operator: z
    .string()
    .refine((value)=>value!="" , {message:"Operator is required"})
    .refine(
      (value) => ["JIO", "AIRTEL", "VI", "BSNL"].includes(value),
      {
        message: "Please select an operator.",
      }
    ),

  amount: z
     .refine(
      (value) => value !== "",
      {
        message: "Amount is required.",
      }
    )
    .refine(
      (value) => !isNaN(Number(value)),
      {
        message: "Please enter a valid amount.",
      }
    )
    .refine(
      (value) => Number(value) > 0,
      {
        message: "Amount must be greater than 0.",
      }
    ),
});