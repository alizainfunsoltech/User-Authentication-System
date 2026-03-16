"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogin = () => {

        const token = localStorage.getItem("token");

        if (token) {
            router.push("/profile");
        } else {
            router.push("/login");
        }

    };

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white shadow">

                <h1 className="text-xl font-bold text-black">
                    Authentication System
                </h1>

                {/* Profile circle */}
                <div className="relative">

                    <div
                        className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer"
                        onClick={() => setOpen(!open)}
                    >
                        A
                    </div>

                    {open && (

                        <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg">

                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleLogin}
                            >
                                Login
                            </button>

                        </div>

                    )}

                </div>

            </div>

            {/* Center Content */}
            <div className="flex items-center justify-center h-[80vh]">

                <h2 className="text-3xl text-black font-bold">
                    Welcome Home
                </h2>

            </div>

        </div>

    );

}