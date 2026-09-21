import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiArrowRight,
    FiLock,
    FiMail,
    FiShield,
    FiUser,
} from "react-icons/fi";
import { loginUser } from "../service/AuthService";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { setAuthUser } = useContext(AuthContext);

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        if (!identifier.trim() || !password) {
            toast.error("Please enter username/email and password");
            return;
        }

        setLoading(true);

        try {
            // Username OR Email
            const data = await loginUser(
                identifier.trim(),
                password
            );

            // Get user saved by AuthService
            const savedUser =
                JSON.parse(localStorage.getItem("user")) || {};

            const loggedInUser = {
                ...savedUser,

                id: data.user_id || savedUser.id,

                username:
                    data.username ||
                    savedUser.username ||
                    "",

                email:
                    data.email ||
                    savedUser.email ||
                    "",

                role:
                    data.role ||
                    savedUser.role ||
                    "user",
            };

            // Save complete user information
            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            // Update AuthContext
            setAuthUser(loggedInUser);

            toast.success("Login successful!");

            // Redirect according to role
            if (loggedInUser.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/profile");
            }

        } catch (error) {
            toast.error(
                error.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10 md:py-12">

            {/* ================= BACKGROUND DECORATIONS ================= */}

            <div className="absolute -top-24 sm:-top-32 -left-24 sm:-left-32 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-blue-200/40 blur-3xl"></div>

            <div className="absolute -bottom-24 sm:-bottom-32 -right-24 sm:-right-32 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-cyan-200/40 blur-3xl"></div>

            <div className="absolute top-16 sm:top-20 right-8 sm:right-20 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400/50 float-animation"></div>

            <div className="absolute bottom-20 sm:bottom-28 left-8 sm:left-20 w-2 h-2 rounded-full bg-cyan-400/60 float-animation"></div>


            {/* ================= MAIN CONTENT ================= */}

            <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">


                {/* ================= LEFT INFORMATION ================= */}

                <div className="hidden lg:block page-enter">

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


                        {/* Platform Badge */}

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-5">

                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>

                            Smart City Platform

                        </div>


                        {/* Heading */}

                        <h1 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">

                            Welcome back to your

                            <span className="gradient-text">
                                {" "}CityPulse
                            </span>

                            {" "}community.

                        </h1>


                        {/* Description */}

                        <p className="mt-5 text-slate-500 leading-7">

                            Login to report city problems, track your complaints,
                            request services, and stay connected with your community.

                        </p>


                        {/* Features */}

                        <div className="mt-8 space-y-4">

                            {/* Personal Dashboard */}

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                                    <FiUser size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Personal Dashboard
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Manage your reports and requests
                                    </p>

                                </div>

                            </div>


                            {/* Secure Access */}

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">

                                    <FiShield size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Secure Access
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Protected account and role-based access
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= LOGIN CARD ================= */}

                <div className="w-full max-w-md mx-auto">

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-city-lg border border-white p-5 sm:p-7 md:p-9 page-enter">


                        {/* ================= MOBILE LOGO ================= */}

                        <div className="lg:hidden text-center mb-6 sm:mb-7">

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


                        {/* ================= HEADING ================= */}

                        <div className="text-center mb-6 sm:mb-7">

                            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">

                                <FiLock size={23} />

                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                                Welcome Back
                            </h2>

                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                                Login to your CityPulse account
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form
                            onSubmit={handleLogin}
                            className="space-y-4 sm:space-y-5"
                        >

                            {/* Username / Email */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Username / Email
                                </label>

                                <div className="relative">

                                    <FiMail
                                        size={18}
                                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Enter username or email"
                                        className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base"
                                        value={identifier}
                                        onChange={(e) =>
                                            setIdentifier(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <FiLock
                                        size={18}
                                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* Forgot Password */}

                            <div className="flex justify-end">

                                <Link
                                    to="/forgot-password"
                                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-cyan-600 transition-colors"
                                >
                                    Forgot Password?
                                </Link>

                            </div>


                            {/* Login Button */}

                            <button
                                type="submit"
                                className="btn w-full min-h-11 sm:min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 text-sm sm:text-base"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <FiArrowRight size={18} />
                                    </>
                                )}

                            </button>

                        </form>


                        {/* ================= DIVIDER ================= */}

                        <div className="flex items-center gap-3 my-6 sm:my-7">

                            <div className="h-px bg-slate-200 flex-1"></div>

                            <span className="text-xs font-medium text-slate-400">
                                OR
                            </span>

                            <div className="h-px bg-slate-200 flex-1"></div>

                        </div>


                        {/* ================= REGISTER ================= */}

                        <p className="text-center text-xs sm:text-sm text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="text-blue-600 font-semibold hover:text-cyan-600 transition-colors"
                            >
                                Create Account
                            </Link>

                        </p>


                        {/* ================= BACK HOME ================= */}

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 mt-5 sm:mt-6 text-xs sm:text-sm text-slate-400 hover:text-blue-600 transition-colors"
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

export default Login;