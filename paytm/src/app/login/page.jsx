"use client";
import {useState} from "react";
import {login} from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/validations/authValidation";
import toast from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";


export default function Login() {
  const router = useRouter();

  const [formData , setFormData] = useState({
    email:"",
    password:""
  });
  const [loading, setLoading] = useState(false);
  const [errors , setErrors]=useState({});

  function handleChange(e){
    setFormData((prev)=>({...prev , [e.target.name]:e.target.value}))

  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    setLoading(true);

    try {
      const validation = loginSchema.safeParse(formData);

      if(!validation.success){
        const newErrors={};
        validation.error.issues.forEach((issue)=>{
          const field = issue.path[0]
          if(!newErrors[field]){
            newErrors[field]=issue.message
          }

        })
        setErrors(newErrors);
        return;
      }
        const response = await login(validation.data);

        if (response.data.success) {
            toast.success("Logged in successfully");
            router.push("/dashboard");
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Something went wrong"
        );
    }finally {
        setLoading(false);
    }
}


  return (
    <div className=" relative min-h-screen bg-[var(--background)] flex items-center justify-center px-4 transition-colors duration-300">
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
            Welcome Back! Login to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              Email Address
            </label>
           

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300" 
              name="email"
              value={formData.email}
              onChange={handleChange}

            />
              {errors.email && (
    <p className="text-red-500 text-sm mt-1">
        {errors.email}
    </p>)}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-secondary)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
            {errors.password && (
    <p className="text-red-500 text-sm mt-1">
        {errors.password}
    </p>)}

          {/* Login Button */}
          <button
    type="submit"
    disabled={loading}
    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-3 font-semibold text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-400"
>
    {loading ? "Logging in..." : "Login"}
</button>

          {/* Register Link */}
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register Now
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}