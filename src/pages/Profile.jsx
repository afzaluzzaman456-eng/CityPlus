import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiCamera,
    FiCheckCircle,
    FiFileText,
    FiHome,
    FiMail,
    FiShield,
    FiTool,
    FiTrash2,
    FiUser,
    FiBell,
} from "react-icons/fi";

import AdminMessageService from "../service/AdminMessageService";

function Profile() {
    const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const token = localStorage.getItem("token");

    let tokenUser = {};

    if (token) {
        try {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            tokenUser = {
                id: payload.id,
                username: payload.sub,
                role: payload.role,
            };
        } catch (error) {
            tokenUser = {};
        }
    }

    const user = {
        ...savedUser,
        ...tokenUser,
    };

    const [profileImage, setProfileImage] = useState(
        localStorage.getItem("profileImage") || ""
    );

    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Profile image must be smaller than 2 MB");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const image = reader.result;

            localStorage.setItem("profileImage", image);
            setProfileImage(image);
        };

        reader.readAsDataURL(file);

        e.target.value = "";
    }

    function handleRemoveImage() {
        localStorage.removeItem("profileImage");
        setProfileImage("");
    }

    // =========================
    // LOAD ADMIN MESSAGES
    // =========================

    useEffect(() => {
        const loadMessages = async () => {
            if (!token) {
                setLoadingMessages(false);
                return;
            }

            try {
                setLoadingMessages(true);

                const data =
                    await AdminMessageService.getUserMessages(token);

                setMessages(data);
            } catch (error) {
                console.error(
                    "Failed to load admin messages:",
                    error
                );
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [token]);

    const isAdmin = user.role === "admin";

    const fullName =
        `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
        user.username ||
        "CityPulse User";

    const firstLetter =
        user.firstname?.charAt(0).toUpperCase() ||
        user.username?.charAt(0).toUpperCase() ||
        "U";

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            {/* =========================
                BACKGROUND DECORATIONS
            ========================= */}

            <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 md:-top-40 md:-right-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-blue-200/30 blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 md:-bottom-40 md:-left-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cyan-200/30 blur-3xl"></div>

            <div className="absolute top-24 left-5 sm:top-32 sm:left-8 md:left-10 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400/40 float-animation"></div>

            <div className="absolute bottom-24 right-8 sm:bottom-28 sm:right-12 md:bottom-32 md:right-16 w-2 h-2 rounded-full bg-cyan-400/50 float-animation"></div>


            {/* =========================
                MAIN CONTAINER
            ========================= */}

            <div className="relative max-w-5xl mx-auto page-enter">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <div className="mb-6 sm:mb-8">

                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3">

                        <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FiUser size={19} className="sm:hidden" />
                            <FiUser size={21} className="hidden sm:block" />
                        </div>

                        <div className="min-w-0">

                            <p className="text-xs sm:text-sm font-semibold text-blue-600">
                                Account Center
                            </p>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                                My Profile
                            </h1>

                        </div>

                    </div>

                    <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                        View and manage your CityPulse account information,
                        profile and city service activities.
                    </p>

                </div>


                {/* =========================
                    MAIN PROFILE CARD
                ========================= */}

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-city-lg border border-white overflow-hidden">

                    {/* =========================
                        PROFILE HERO
                    ========================= */}

                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 sm:px-6 md:px-10 py-7 sm:py-8 md:py-10">

                        <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white/10"></div>

                        <div className="absolute -bottom-16 sm:-bottom-20 left-1/3 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white/10"></div>


                        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">

                            {/* =========================
                                PROFILE IMAGE
                            ========================= */}

                            <div className="relative shrink-0">

                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white/30 backdrop-blur-sm shadow-xl">

                                    <div className="w-full h-full rounded-full overflow-hidden bg-white">

                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 flex items-center justify-center">

                                                <span className="text-4xl sm:text-5xl font-bold">
                                                    {firstLetter}
                                                </span>

                                            </div>
                                        )}

                                    </div>

                                </div>


                                {/* Camera Button */}

                                <label className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-blue-600 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">

                                    <FiCamera size={17} className="sm:hidden" />
                                    <FiCamera size={18} className="hidden sm:block" />

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                </label>

                            </div>


                            {/* =========================
                                USER INFORMATION
                            ========================= */}

                            <div className="text-center sm:text-left text-white flex-1 min-w-0 w-full">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 sm:gap-3">

                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
                                        {fullName}
                                    </h2>

                                    <span className="badge border-none bg-white/20 text-white mx-auto sm:mx-0">

                                        <FiCheckCircle size={13} />

                                        Active

                                    </span>

                                </div>


                                <p className="text-white/80 mt-1 text-sm sm:text-base break-words">
                                    @{user.username || "username"}
                                </p>


                                <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-4">

                                    <span className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-white/80 break-all">

                                        <FiMail size={15} className="shrink-0" />

                                        <span>
                                            {user.email || "Email unavailable"}
                                        </span>

                                    </span>


                                    <span className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-white/80">

                                        <FiShield size={15} className="shrink-0" />

                                        {isAdmin
                                            ? "Administrator"
                                            : "CityPulse User"}

                                    </span>

                                </div>

                            </div>


                            {/* =========================
                                ROLE BADGE
                            ========================= */}

                            <div className="hidden sm:flex shrink-0">

                                <div className="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-center">

                                    <p className="text-xs text-white/70">
                                        ACCOUNT TYPE
                                    </p>

                                    <p className="text-sm font-bold text-white capitalize mt-1">
                                        {user.role || "user"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        PROFILE CONTENT
                    ========================= */}

                    <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                        {/* =========================
                            PHOTO CONTROLS
                        ========================= */}

                        <div className="flex flex-col xs:flex-row sm:flex-wrap gap-2.5 sm:gap-3 mb-7 sm:mb-8">

                            <label className="btn btn-sm sm:btn-md rounded-xl bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 cursor-pointer w-full sm:w-auto">

                                <FiCamera size={16} />

                                Change Photo

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />

                            </label>


                            {profileImage && (
                                <button
                                    onClick={handleRemoveImage}
                                    className="btn btn-sm sm:btn-md rounded-xl btn-outline btn-error w-full sm:w-auto"
                                >

                                    <FiTrash2 size={16} />

                                    Remove Photo

                                </button>
                            )}

                        </div>


                        {/* =========================
                            ACCOUNT INFORMATION
                        ========================= */}

                        <div className="mb-7 sm:mb-8">

                            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">

                                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                                    <FiUser size={18} />

                                </div>

                                <div className="min-w-0">

                                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                        Account Information
                                    </h3>

                                    <p className="text-xs sm:text-sm text-slate-400">
                                        Your registered CityPulse account details
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                                {/* First Name */}

                                <div className="group bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        First Name
                                    </p>

                                    <p className="font-semibold text-slate-700 mt-2 text-sm sm:text-base break-words">
                                        {user.firstname || "Not available"}
                                    </p>

                                </div>


                                {/* Last Name */}

                                <div className="group bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Last Name
                                    </p>

                                    <p className="font-semibold text-slate-700 mt-2 text-sm sm:text-base break-words">
                                        {user.lastname || "Not available"}
                                    </p>

                                </div>


                                {/* Username */}

                                <div className="group bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Username
                                    </p>

                                    <p className="font-semibold text-slate-700 mt-2 text-sm sm:text-base break-words">
                                        {user.username || "Not available"}
                                    </p>

                                </div>


                                {/* Email */}

                                <div className="group bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Email Address
                                    </p>

                                    <p className="font-semibold text-slate-700 mt-2 text-sm sm:text-base break-all">
                                        {user.email || "Not available"}
                                    </p>

                                </div>


                                {/* Account Type */}

                                <div className="group bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Account Type
                                    </p>

                                    <div className="mt-2">

                                        <span
                                            className={`badge ${isAdmin
                                                ? "badge-warning"
                                                : "badge-primary"
                                                }`}
                                        >
                                            {isAdmin
                                                ? "Administrator"
                                                : "User"}
                                        </span>

                                    </div>

                                </div>


                                {/* Account Status */}

                                <div className="group bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-100 rounded-2xl p-4 sm:p-5 transition-all duration-300">

                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Account Status
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">

                                        <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-500 animate-pulse"></span>

                                        <span className="font-semibold text-emerald-600 text-sm sm:text-base">
                                            Active
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            ADMIN ANNOUNCEMENTS
                        ========================= */}

                        {!isAdmin && (
                            <div className="border-t border-slate-100 pt-7 sm:pt-8 mb-7 sm:mb-8">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5">

                                    <div className="flex items-center gap-2.5 sm:gap-3">

                                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                                            <FiBell size={18} />

                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                                Admin Announcements
                                            </h3>

                                            <p className="text-xs sm:text-sm text-slate-400">
                                                Important updates from CityPulse administration
                                            </p>

                                        </div>

                                    </div>


                                    {messages.length > 0 && (
                                        <span className="badge badge-warning self-start sm:self-auto shrink-0">
                                            {messages.length}{" "}
                                            {messages.length === 1
                                                ? "Message"
                                                : "Messages"}
                                        </span>
                                    )}

                                </div>


                                {/* Loading */}

                                {loadingMessages && (
                                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 text-center">

                                        <span className="loading loading-spinner loading-md text-blue-600"></span>

                                        <p className="text-sm text-slate-400 mt-3">
                                            Loading announcements...
                                        </p>

                                    </div>
                                )}


                                {/* No Messages */}

                                {!loadingMessages &&
                                    messages.length === 0 && (
                                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 text-center">

                                            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">

                                                <FiBell size={21} className="sm:hidden" />
                                                <FiBell size={23} className="hidden sm:block" />

                                            </div>

                                            <h4 className="font-bold text-slate-700 mt-4">
                                                No announcements yet
                                            </h4>

                                            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                                                Important messages from the administration
                                                will appear here.
                                            </p>

                                        </div>
                                    )}


                                {/* Messages */}

                                {!loadingMessages &&
                                    messages.length > 0 && (
                                        <div className="space-y-3 sm:space-y-4">

                                            {messages.map((item) => (

                                                <div
                                                    key={item.id}
                                                    className="group relative bg-gradient-to-r from-blue-50/70 to-cyan-50/50 border border-blue-100 rounded-2xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                                >

                                                    {/* Accent */}

                                                    <div className="absolute left-0 top-4 sm:top-5 bottom-4 sm:bottom-5 w-1 rounded-r-full bg-gradient-to-b from-blue-600 to-cyan-500"></div>


                                                    <div className="flex items-start gap-3 sm:gap-4 pl-2">

                                                        {/* Icon */}

                                                        <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-white text-blue-600 shadow-sm flex items-center justify-center">

                                                            <FiBell size={17} className="sm:hidden" />
                                                            <FiBell size={19} className="hidden sm:block" />

                                                        </div>


                                                        {/* Content */}

                                                        <div className="flex-1 min-w-0">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <h4 className="font-bold text-slate-800 text-base sm:text-lg break-words">
                                                                    {item.title}
                                                                </h4>

                                                                <span className="badge badge-sm badge-primary">
                                                                    Announcement
                                                                </span>

                                                            </div>


                                                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 break-words">
                                                                {item.message}
                                                            </p>


                                                            <div className="flex items-start sm:items-center gap-2 mt-4">

                                                                <FiCheckCircle
                                                                    size={14}
                                                                    className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0"
                                                                />

                                                                <span className="text-[11px] sm:text-xs text-slate-400 break-words">
                                                                    {item.created_at
                                                                        ? new Date(
                                                                            item.created_at
                                                                        ).toLocaleString()
                                                                        : "Recently sent"}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>
                                    )}

                            </div>
                        )}


                        {/* =========================
                            QUICK ACTIONS
                        ========================= */}

                        <div className="border-t border-slate-100 pt-7 sm:pt-8">

                            <div className="flex items-center gap-2.5 sm:gap-3 mb-5">

                                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">

                                    <FiTool size={18} />

                                </div>

                                <div className="min-w-0">

                                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                        Quick Actions
                                    </h3>

                                    <p className="text-xs sm:text-sm text-slate-400">
                                        Quickly access your CityPulse activities
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                                {/* Complaints */}

                                <Link
                                    to="/complaints/my"
                                    className="group rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-blue-200 hover:bg-blue-50/60 hover:-translate-y-1 transition-all duration-300"
                                >

                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                                        <FiFileText size={19} />

                                    </div>

                                    <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                                        My Complaints
                                    </h4>

                                    <p className="text-xs text-slate-400 mt-1">
                                        View your city complaints
                                    </p>

                                </Link>


                                {/* Services */}

                                <Link
                                    to="/services"
                                    className="group rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-cyan-200 hover:bg-cyan-50/60 hover:-translate-y-1 transition-all duration-300"
                                >

                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                                        <FiTool size={19} />

                                    </div>

                                    <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                                        My Services
                                    </h4>

                                    <p className="text-xs text-slate-400 mt-1">
                                        View your service requests
                                    </p>

                                </Link>


                                {/* Admin Dashboard */}

                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="group rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-amber-200 hover:bg-amber-50/60 hover:-translate-y-1 transition-all duration-300"
                                    >

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                                            <FiShield size={19} />

                                        </div>

                                        <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                                            Admin Dashboard
                                        </h4>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Manage platform
                                        </p>

                                    </Link>
                                )}


                                {/* Admin Profile */}

                                {isAdmin && (
                                    <Link
                                        to="/admin/profile"
                                        className="group rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-purple-200 hover:bg-purple-50/60 hover:-translate-y-1 transition-all duration-300"
                                    >

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                                            <FiMail size={19} />

                                        </div>

                                        <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                                            Admin Profile
                                        </h4>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Send announcements
                                        </p>

                                    </Link>
                                )}


                                {/* Home */}

                                <Link
                                    to="/"
                                    className="group rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300"
                                >

                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                                        <FiHome size={19} />

                                    </div>

                                    <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                                        Back to Home
                                    </h4>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Return to homepage
                                    </p>

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;