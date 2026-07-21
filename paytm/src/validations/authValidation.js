import {z} from "zod";


export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required."),

    email: z
      .string()
      .min(1, "Email is required.")
      .email({
    error: "Please enter a valid email.",
  }),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required.")
      .regex(
        /^\d{10}$/,
        "Phone number must be exactly 10 digits."
      ),

    password: z
      .string()
      .min(1, "Password is required.")
      .min(
        8,
        "Password must be at least 8 characters."
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password."
      ),
  })
  .superRefine((data, ctx) => {
    if (
      data.password.length >= 8 &&
      data.password !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    
});


export const registerApiSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required."),

  email: z
    .string()
    .email("Please enter a valid email."),

  phoneNumber: z
    .string()
    .regex(
      /^\d{10}$/,
      "Phone number must be exactly 10 digits."
    ),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters."
    ),
});