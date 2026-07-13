"use client";
import {useState} from "react";
import {login} from "@/services/auth"


export default function Login() {

  const [formData , setFormData] = useState({
    email:"",
    password:""
  });

  function handleChange(e){
    setFormData((prev)=>({...prev , [e.target.name]:e.target.value}))

  }

  async function handleSubmit(e){
    e.preventDefault();
    await login(formData);
    alert("logged in successfully")

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
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Login
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register Now
            </a>
          </p>

        </form>

      </div>
    </div>
  );
}