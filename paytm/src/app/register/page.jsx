"use client";
import { useState } from "react";
import {register} from "@/services/auth";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/validations/authValidation";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    phoneNumber:"",
    password:"",
  confirmPassword:""});

  const [errors , setErrors] = useState({});

    const handleChange=(e)=>{
      setFormData((prev)=>({...prev , [e.target.name]:e.target.value}));
}
    const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  

 
  try {
    const validation = registerSchema.safeParse(formData);

    if(!validation.success){
      const newErrors={};
      validation.error.issues.forEach((issue)=>{
        const field = issue.path[0];
        if(!newErrors[field]){
          newErrors[field]=issue.message;
        }
      })
      setErrors(newErrors);
      return;
    }
    const response =await register({
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    });
    if (response.data.success) {
    toast.success("Registration successful!");
    router.push("/dashboard");}
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className=" relative min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="absolute right-5 top-5">
      <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-xl p-8 transition-colors duration-300">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Recharge System
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Create your account
          </p>
        </div>

        {/* Register Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text)]">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && (
    <p className="text-red-500 text-sm mt-1">
        {errors.name}
    </p>)}

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text)]">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              name="email" value={formData.email} onChange={handleChange}
            />
          </div>

          {errors.email && (
    <p className="text-red-500 text-sm mt-1">
        {errors.email}
    </p>)}

          {/* Phone Number */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text)]">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
               name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
            />
          </div>
          {errors.phoneNumber && (
    <p className="text-red-500 text-sm mt-1">
        {errors.phoneNumber}
    </p>)}

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--text)]">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              name="password" value={formData.password} onChange={handleChange}
            />
          </div>
          {errors.password && (
    <p className="text-red-500 text-sm mt-1">
        {errors.password}
    </p>)}

          {/* Confirm Password */}
          <div>
            < label className="block mb-2 text-sm font-medium text-[var(--text)]">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
            />
          </div>
             {errors.confirmPassword && (
    <p className="text-red-500 text-sm mt-1">
        {errors.confirmPassword}
    </p>)}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}