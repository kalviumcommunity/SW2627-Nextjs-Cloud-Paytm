import { z } from "zod";

export const rechargeSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),

 operator: z
    .string()
    .refine(
      (value) => ["JIO", "AIRTEL", "VI", "BSNL"].includes(value),
      {
        message: "Please select an operator.",
      }
    ),

  amount: z.coerce
    .number({
      message: "Please enter a valid amount.",
    })
    .positive("Amount must be greater than 0."),
});