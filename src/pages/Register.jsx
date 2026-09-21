import { useState } from "react";
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
import { registerUser } from "../service/AuthService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleRegister(e) {
        e.preventDefault();

        setError("");

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await registerUser(formData);

            toast.success("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setError(error.message || "Registration failed");
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-3 sm:px-5 md:px-6 py-6 sm:py-10 md:py-12">

            {/* =========================
                BACKGROUND DECORATIONS
            ========================= */}

            <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 md:-top-40 md:-right-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-blue-200/40 blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 md:-bottom-40 md:-left-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cyan-200/40 blur-3xl"></div>

            <div className="absolute top-20 left-8 sm:top-24 sm:left-14 md:left-20 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400/50 float-animation"></div>

            <div className="absolute bottom-20 right-10 sm:bottom-24 sm:right-16 md:right-24 w-2 h-2 rounded-full bg-cyan-400/60 float-animation"></div>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">

                {/* =========================
                    LEFT INFORMATION
                ========================= */}

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


                        {/* Community Badge */}

                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium mb-5">

                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>

                            Join the Community

                        </div>


                        {/* Heading */}

                        <h1 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">

                            Create your

                            <span className="gradient-text">
                                {" "}CityPulse
                            </span>

                            {" "}account.

                        </h1>


                        <p className="mt-5 text-slate-500 leading-7">

                            Join your community and help make your city
                            cleaner, safer, and better for everyone.

                        </p>


                        {/* Benefits */}

                        <div className="mt-8 space-y-4">

                            {/* Personal Profile */}

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                    <FiUser size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Personal Profile
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Keep your city reports organized
                                    </p>

                                </div>

                            </div>


                            {/* Secure Account */}

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">

                                    <FiShield size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Secure Account
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Protected access to your account
                                    </p>

                                </div>

                            </div>


                            {/* Make an Impact */}

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                    <FiArrowRight size={18} />

                                </div>

                                <div>

                                    <p className="font-semibold text-slate-700">
                                        Make an Impact
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        Report issues and help your community
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    REGISTER CARD
                ========================= */}

                <div className="w-full max-w-lg mx-auto">

                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-city-lg border border-white p-5 sm:p-7 md:p-9 page-enter">

                        {/* =========================
                            MOBILE LOGO
                        ========================= */}

                        <div className="lg:hidden text-center mb-6 sm:mb-7">

                            <Link
                                to="/"
                                className="inline-flex items-center gap-2"
                            >

                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center">

                                    <FiShield size={19} className="sm:hidden" />
                                    <FiShield size={20} className="hidden sm:block" />

                                </div>

                                <div className="text-xl sm:text-2xl font-bold">

                                    <span className="text-blue-600">
                                        City
                                    </span>

                                    <span className="text-slate-800">
                                        Pulse
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* =========================
                            HEADING
                        ========================= */}

                        <div className="text-center mb-6 sm:mb-7">

                            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">

                                <FiUser size={22} className="sm:hidden" />
                                <FiUser size={25} className="hidden sm:block" />

                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                                Create Account
                            </h2>

                            <p className="text-sm sm:text-base text-slate-500 mt-2">
                                Join CityPulse and make your city better
                            </p>

                        </div>


                        {/* =========================
                            ERROR
                        ========================= */}

                        {error && (
                            <div className="alert alert-error rounded-xl mb-5 text-xs sm:text-sm">

                                <span className="break-words">
                                    {error}
                                </span>

                            </div>
                        )}


                        {/* =========================
                            FORM
                        ========================= */}

                        <form
                            onSubmit={handleRegister}
                            className="space-y-3.5 sm:space-y-4"
                        >

                            {/* =========================
                                USERNAME
                            ========================= */}

                            <div>

                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                    Username
                                </label>

                                <div className="relative">

                                    <FiUser
                                        size={17}
                                        className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base min-h-11 sm:min-h-12"
                                        value={formData.username}
                                        onChange={handleChange}
                                        minLength={3}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =========================
                                EMAIL
                            ========================= */}

                            <div>

                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>

                                <div className="relative">

                                    <FiMail
                                        size={17}
                                        className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base min-h-11 sm:min-h-12"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =========================
                                FIRST + LAST NAME
                            ========================= */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                                {/* First Name */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="First name"
                                        className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base min-h-11 sm:min-h-12"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Last Name */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="Last name"
                                        className="input input-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base min-h-11 sm:min-h-12"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =========================
                                PASSWORD
                            ========================= */}

                            <div>

                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <FiLock
                                        size={17}
                                        className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a password"
                                        className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm sm:text-base min-h-11 sm:min-h-12"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength={6}
                                        required
                                    />

                                </div>

                                <p className="text-[11px] sm:text-xs text-slate-400 mt-2 leading-relaxed">
                                    Password must contain at least 6 characters.
                                </p>

                            </div>


                            {/* =========================
                                CREATE ACCOUNT
                            ========================= */}

                            <button
                                type="submit"
                                className="btn w-full min-h-11 sm:min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white text-sm sm:text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 mt-2"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <FiArrowRight size={18} />
                                    </>
                                )}

                            </button>

                        </form>


                        {/* =========================
                            DIVIDER
                        ========================= */}

                        <div className="flex items-center gap-3 my-6 sm:my-7">

                            <div className="h-px bg-slate-200 flex-1"></div>

                            <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                                OR
                            </span>

                            <div className="h-px bg-slate-200 flex-1"></div>

                        </div>


                        {/* =========================
                            LOGIN
                        ========================= */}

                        <p className="text-center text-xs sm:text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:text-cyan-600 transition-colors"
                            >
                                Login
                            </Link>

                        </p>


                        {/* =========================
                            BACK HOME
                        ========================= */}

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

export default Register;