"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";

export default function Navbar() {
    const router = useRouter();

    async function handleLogout() {
        try {
            await logout();
            router.replace("/login");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className="bg-blue-600 text-white p-4 shadow">
            <div className="max-w-6xl mx-auto flex justify-between">
                <h1 className="text-2xl font-bold">
                    Recharge System
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}