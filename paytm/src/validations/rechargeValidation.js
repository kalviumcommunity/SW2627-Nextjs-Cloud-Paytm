import { z } from "zod";

export const rechargeSchema = z.object({
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  operator: z.enum([
    "JIO",
    "AIRTEL",
    "VI",
    "BSNL",
  ]),

  amount: z
    .number()
    .positive("Amount must be greater than 0"),
});