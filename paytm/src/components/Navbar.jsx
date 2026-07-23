"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import toast from "react-hot-toast";


export default function Navbar() {
    const router = useRouter();

    async function handleLogout() {
        try {
            const response = await logout();
            if(response.data.success){
                toast.success("Logged out successfully");
            }
            router.replace("/login");
        } catch (err) {
            toast.error( err.response?.data?.message || "Failed to log out" );
        }
    }

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

                {/* Logo / App Name */}
                <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
                    Recharge System
                </h1>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 sm:px-4 sm:text-base"
                >
                    Logout
                </button>

            </div>
        </nav>
    );
}