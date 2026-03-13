"use client";

import {useState} from "react";
import API from "../lib/api";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Signup() {

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const signup = async () => {

        try {

            setErrors({});
            setLoading(true);

            await API.post("signup/", {
                username,
                email,
                password
            });

            // save email for verify page
            localStorage.setItem("verifyEmail", email);

            router.push("/verify");

        } catch (err) {

            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                console.log(err);
            }

        } finally {
            setLoading(false);
        }

    }

    return (

        <div
            className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-400 to-purple-500 p-10">

            <div className="bg-white rounded-3xl shadow-2xl flex overflow-hidden w-275">

                {/* LEFT SIDE FORM */}

                <div className="w-1/2 p-12 flex flex-col justify-center">

                    <h1 className="text-4xl font-bold mb-12 text-black">
                        Create account
                    </h1>

                    {/* USERNAME */}

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {errors.username && (

                        <p className="text-red-500 text-sm mb-4">
                            {errors.username[0]}
                        </p>
                    )}

                    {/* EMAIL */}

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {errors.email && (

                        <p className="text-red-500 text-sm mb-4">
                            {errors.email[0]}
                        </p>
                    )}

                    {/* PASSWORD */}

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {errors.password && (

                        <p className="text-red-500 text-sm mb-4">
                            {errors.password[0]}
                        </p>
                    )}

                    <button
                        className={`w-full p-3 rounded-lg text-white transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        onClick={signup}
                        disabled={loading}

                    >

                        {loading ? "Creating account..." : "Create account"}

                    </button>

                    <p className="text-gray-500 mt-6">
                        Already have an account?
                        <span
                            className="text-purple-600 cursor-pointer ml-1"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </span>
                    </p>

                </div>

                {/* RIGHT SIDE IMAGE */}

                <div className="w-1/2 bg-purple-200 flex items-center justify-center">

                    <Image
                        src="/auth-image.png"
                        alt="auth"
                        width={500}
                        height={500}
                        className="w-full"
                    />

                </div>

            </div>

        </div>

    )

}
