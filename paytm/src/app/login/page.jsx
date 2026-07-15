"use client";
import {useState} from "react";
import {login} from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Login() {
  const router = useRouter();

  const [formData , setFormData] = useState({
    email:"",
    password:""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e){
    setFormData((prev)=>({...prev , [e.target.name]:e.target.value}))

  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
        const response = await login(formData);

        if (response.data.success) {
            alert("Logged in successfully");
            router.push("/dashboard");
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Something went wrong"
        );
    }finally {
        setLoading(false);
    }
}


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Recharge System
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome Back! Login to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              value={formData.email}
              onChange={handleChange}

            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <button
    type="submit"
    disabled={loading}
    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:bg-gray-400"
>
    {loading ? "Logging in..." : "Login"}
</button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
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