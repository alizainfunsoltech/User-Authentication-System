"use client";

import {useEffect, useState} from "react";
import API from "../lib/api";
import {useRouter} from "next/navigation";

export default function Profile() {

    const router = useRouter();

    const [user, setUser] = useState({});
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        API.get("profile/", {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(res => {
                setUser(res.data);
                setUsername(res.data.username);
                setLoading(false);
            })
            .catch(err => {

                console.log("PROFILE ERROR:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login");
                } else {
                    setError("Failed to load profile");
                }

                setLoading(false);
            });

    }, [router]);


    const update = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.put("update/", {
                username: username
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            setUser({...user, username});

            setSuccess("Profile updated successfully");
            setMessage("");

        } catch (err) {

            console.log(err);
            setMessage("Update failed");
            setSuccess("");

        }

    };


    const deleteAccount = async () => {

        const confirmDelete = confirm("Are you sure you want to delete your account?");

        if (!confirmDelete) return;

        try {

            const token = localStorage.getItem("token");

            await API.delete("delete/", {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            setSuccess("Account deleted successfully");
            setMessage("");

            localStorage.removeItem("token");

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (err) {

            console.log(err);
            setMessage("Delete failed");
            setSuccess("");

        }

    };


    if (loading) {
        return <div className="p-10 text-lg">Loading profile...</div>
    }

    if (error) {
        return <div className="p-10 text-red-500">{error}</div>
    }

    const logout = async () => {

        try {

            await API.post("logout/")

            localStorage.removeItem("token")

            router.push("/login")

        } catch (err) {

            console.log(err)

        }

    }


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-xl rounded-xl p-10 w-112.5">

                <h1 className="text-black text-3xl font-bold mb-6 text-center">
                    Profile
                </h1>

                {success && (
                    <p className="text-green-500 text-center mb-4">
                        {success}
                    </p>
                )}

                {message && (
                    <p className="text-red-500 text-center mb-4">
                        {message}
                    </p>
                )}

                <div className="mb-4">

                    <label className="block text-gray-600 mb-1">
                        Username
                    </label>

                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-black border p-2 rounded"
                    />

                </div>


                <div className="mb-6">

                    <label className="block text-gray-600 mb-1">
                        Email
                    </label>

                    <p className="bg-gray-100 text-black p-2 rounded">
                        {user.email}
                    </p>

                </div>


                <div className="flex gap-4">

                    <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                        onClick={update}
                    >
                        Update
                    </button>

                    <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        onClick={deleteAccount}
                    >
                        Delete
                    </button>

                </div>

                <button
                    className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

