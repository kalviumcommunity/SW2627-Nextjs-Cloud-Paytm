"use client";
import Link from "next/link";
import { useTheme} from "next-themes";
export default function Home() {
  const { theme } = useTheme();
  if (theme==="dark"){
  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-10">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            Recharge System
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
            Fast, Secure & Reliable Recharges
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Stay connected with quick mobile recharges.
            <br />
            Track live transaction status, view recharge history,
            <br />
            and manage your recharges effortlessly.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="w-64 rounded-lg bg-blue-600 py-3 text-center text-lg font-semibold text-white transition duration-300 hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="w-64 rounded-lg border-2 border-blue-600 py-3 text-center text-lg font-semibold text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Register
          </Link>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-300 dark:border-gray-700"></div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-xl text-green-600">✔</span>
            <span>Live Transaction Tracking</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-xl text-green-600">✔</span>
            <span>Recharge History</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-xl text-green-600">✔</span>
            <span>Smart Filters</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <span className="text-xl text-green-600">✔</span>
            <span>Duplicate Recharge Protection</span>
          </div>

        </div>

      </div>
    </div>
  );
}else{
  return ( <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10"> <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10"> {/* Heading */} <div className="text-center"> <h1 className="text-5xl font-bold text-blue-600"> Recharge System </h1> <h2 className="mt-4 text-2xl font-semibold text-gray-800"> Fast, Secure & Reliable Recharges </h2> <p className="mt-6 text-lg text-gray-600 leading-8"> Stay connected with quick mobile recharges. <br /> Track live transaction status, view recharge history, <br /> and manage your recharges effortlessly. </p> </div> {/* Buttons */} <div className="flex flex-col items-center gap-4 mt-10"> <a href="/login" className="w-64 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300" > Login </a> <a href="/register" className="w-64 border-2 border-blue-600 text-blue-600 text-center py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition duration-300" > Register </a> </div> {/* Divider */} <div className="border-t border-gray-300 my-10"></div> {/* Features */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> <div className="flex items-center gap-3"> <span className="text-green-600 text-xl">✔</span> <span>Live Transaction Tracking</span> </div> <div className="flex items-center gap-3"> <span className="text-green-600 text-xl">✔</span> <span>Recharge History</span> </div> <div className="flex items-center gap-3"> <span className="text-green-600 text-xl">✔</span> <span>Smart Filters</span> </div> <div className="flex items-center gap-3"> <span className="text-green-600 text-xl">✔</span> <span>Duplicate Recharge Protection</span> </div> </div> </div> </div> );
}}