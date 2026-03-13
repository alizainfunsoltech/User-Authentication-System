"use client";

import {useState, useEffect} from "react";
import API from "../lib/api";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Verify() {

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

// Load email saved during signup
    useEffect(() => {

        const savedEmail = localStorage.getItem("verifyEmail")

        if (savedEmail) {
            setEmail(savedEmail)
        }

    }, [])

    const verifyOtp = async () => {

        try {

            setError("")
            setSuccess("")
            setLoading(true)

            const res = await API.post("verify-otp/", {
                email,
                otp
            })

            const token = res.data.data.token

            // store token
            localStorage.setItem("token", token)

            // remove verification email
            localStorage.removeItem("verifyEmail")

            setSuccess("Account verified successfully")

            // wait 2 seconds before redirect
            setTimeout(() => {
                router.push("/profile")
            }, 2000)

        } catch (err) {

            setError(err.response?.data?.message || "Invalid OTP")
            setLoading(false)

        }

    }

    const resendOtp = async () => {

        try {

            setResending(true)
            setError("")
            setSuccess("")

            const res = await API.post("resend-otp/", {
                email
            })

            setSuccess(res.data.message || "OTP sent again")

        } catch (err) {

            console.log(err)
            setError("Failed to resend OTP")

        } finally {

            setResending(false)

        }

    }

    return (

        <div
            className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-400 to-purple-500 p-10">

            <div className="bg-white rounded-3xl shadow-2xl flex overflow-hidden w-275">

                {/* LEFT SIDE FORM */}

                <div className="w-1/2 p-12 flex flex-col justify-center">

                    <h1 className="text-4xl font-bold mb-10 text-black text-center">
                        Verify OTP
                    </h1>

                    {error && (

                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none text-black"
                        value={email}
                        readOnly
                    />

                    <input
                        className="w-full p-3 mb-6 bg-gray-300 rounded-lg outline-none placeholder-gray-500 text-black"
                        placeholder="Enter OTP"
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <p className="text-sm text-gray-500 text-center mb-6">
                        Didnt receive OTP?
                        <span
                            className={`ml-2 font-semibold ${
                                resending ? "text-gray-400 cursor-not-allowed" : "text-purple-600 cursor-pointer"
                            }`}
                            onClick={!resending ? resendOtp : null}
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </span>

                    </p>

                    <button
                        className={`w-full py-4 rounded-lg text-lg font-semibold text-white transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        onClick={verifyOtp}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <p className="text-gray-500 mt-6 text-center">
                        Back to
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
