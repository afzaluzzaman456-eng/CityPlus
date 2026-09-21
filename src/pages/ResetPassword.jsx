// src/pages/ResetPassword.jsx

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiArrowRight,
    FiKey,
    FiLock,
    FiShield,
} from "react-icons/fi";

import { resetPassword } from "../service/AuthService";


function ResetPassword() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // First get token from URL
    const urlToken = searchParams.get("token");

    // If URL token is missing, use localStorage token
    const storedToken = localStorage.getItem("reset_token");

    const resetToken = urlToken || storedToken;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();

        if (!resetToken) {
            toast.error("Invalid or expired reset link");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter your new password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (!confirmPassword) {
            toast.error("Please confirm your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            console.log("Reset token:", resetToken);

            const data = await resetPassword(
                resetToken,
                newPassword
            );

            console.log(
                "Reset password response:",
                data
            );

            // Remove used reset token
            localStorage.removeItem("reset_token");

            toast.success(
                data?.message ||
                "Password reset successfully!"
            );

            // Go to login
            navigate("/login", {
                replace: true,
            });

        } catch (error) {
            console.error(
                "Reset Password Error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Password reset failed";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-6 py-12">

            {/* Background Decorations */}

            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl"></div>

            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl"></div>

            <div className="absolute top-24 right-24 w-3 h-3 rounded-full bg-blue-400/50"></div>

            <div className="absolute bottom-24 left-24 w-2 h-2 rounded-full bg-cyan-400/60"></div>


            {/* Main Content */}

            <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">


                {/* LEFT INFORMATION */}

                <div className="hidden lg:block">

                    <div className="max-w-md">

                        {/* Logo */}

                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 group mb-8"
                        >

                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">

                                <FiShield size={23} />

                            </div>

                            <div className="text-3xl font-bold">

                                <span className="text-blue-600">
                                    City
                                </span>

                                <span className="text-slate-800">
                                    Pulse
                                </span>

                            </div>

                        </Link>


                        {/* Badge */}

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-5">

                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>

                            Password Recovery

                        </div>


                        {/* Heading */}

                        <h1 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">

                            Create your new

                            <span className="text-blue-600">
                                {" "}secure password.
                            </span>

                        </h1>


                        <p className="mt-5 text-slate-500 leading-7">

                            Choose a new password for your CityPulse
                            account and continue securely.

                        </p>


                        {/* Recovery Steps */}

                        <div className="mt-8 space-y-4">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                    <FiShield size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Account Verified
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Your reset request is verified
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">

                                    <FiKey size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Create New Password
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Choose a new secure password
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                    <FiLock size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Login Again
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Use your new password to login
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* RESET PASSWORD CARD */}

                <div className="w-full max-w-md mx-auto">

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-city-lg border border-white p-7 sm:p-9">


                        {/* Mobile Logo */}

                        <div className="lg:hidden text-center mb-7">

                            <Link
                                to="/"
                                className="inline-flex items-center gap-2"
                            >

                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center">

                                    <FiShield size={20} />

                                </div>

                                <div className="text-2xl font-bold">

                                    <span className="text-blue-600">
                                        City
                                    </span>

                                    <span className="text-slate-800">
                                        Pulse
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* Heading */}

                        <div className="text-center mb-7">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">

                                <FiLock size={25} />

                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">

                                Create New Password

                            </h2>

                            <p className="text-slate-500 mt-2">

                                Enter your new password below

                            </p>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* New Password */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">

                                    New Password

                                </label>

                                <div className="relative">

                                    <FiLock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="input input-bordered w-full pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        minLength={6}
                                        required
                                    />

                                </div>

                                <p className="text-xs text-slate-400 mt-2">

                                    Password must be at least 6 characters.

                                </p>

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">

                                    Confirm Password

                                </label>

                                <div className="relative">

                                    <FiLock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="input input-bordered w-full pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        minLength={6}
                                        required
                                    />

                                </div>

                            </div>


                            {/* Reset Button */}

                            <button
                                type="submit"
                                className="btn w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>

                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        Reset Password

                                        <FiArrowRight size={18} />
                                    </>
                                )}

                            </button>

                        </form>


                        {/* Divider */}

                        <div className="flex items-center gap-3 my-7">

                            <div className="h-px bg-slate-200 flex-1"></div>

                            <span className="text-xs font-medium text-slate-400">
                                OR
                            </span>

                            <div className="h-px bg-slate-200 flex-1"></div>

                        </div>


                        {/* Login */}

                        <p className="text-center text-sm text-slate-500">

                            Remember your password?{" "}

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:text-cyan-600 transition-colors"
                            >
                                Back to Login
                            </Link>

                        </p>


                        {/* Back Home */}

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 hover:text-blue-600 transition-colors"
                        >

                            <FiArrowLeft size={15} />

                            Back to Home

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;