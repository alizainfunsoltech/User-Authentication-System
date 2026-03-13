"use client";

import {useState} from "react";
import API from "../lib/api";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Login() {

    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const login = async () => {

        try {

            setError("")
            setLoading(true)


            const res = await API.post("login/", {
                username,
                password
            })

            localStorage.setItem("token", res.data.token)

            router.push("/profile")

        } catch (err) {

            const data = err.response?.data


            if (data?.verify_required) {

                localStorage.setItem("verifyEmail", data.email)

                router.push("/verify")

            } else if (data) {

                setError("Invalid username or password")

            } else {

                console.log(err)
                setError("Login failed")

            }

        } finally {

            setLoading(false)

        }

    }

    return (

        <div
            className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-400 to-purple-500 p-10">

            <div className="bg-white rounded-3xl shadow-2xl flex overflow-hidden w-275">

                {/* LEFT SIDE FORM */}

                <div className="w-1/2 p-12 flex flex-col justify-center items-center">

                    <h1 className="text-4xl font-bold mb-10 text-black">
                        Hello Again!
                    </h1>

                    {error && (

                        <p className="text-red-500 text-sm mb-4">
                            {error}
                        </p>
                    )}

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className={`w-full p-3 rounded-lg font-bold text-white transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        onClick={login}
                        disabled={loading}

                    >

                        {loading ? "Logging in..." : "Login"} </button>

                    <p className="text-gray-500 mt-6">
                        Dont have an account?
                        <span
                            className="text-purple-600 cursor-pointer ml-1"
                            onClick={() => router.push("/signup")}
                        > Signup </span>
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
