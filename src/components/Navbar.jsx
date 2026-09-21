import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiBell,
    FiChevronDown,
    FiHome,
    FiInfo,
    FiLogIn,
    FiLogOut,
    FiMail,
    FiMenu,
    FiUser,
    FiX,
} from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { authUser, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [mobileMenu, setMobileMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    function handleLogout() {
        logout();
        setProfileMenu(false);
        setMobileMenu(false);
        navigate("/login");
    }

    function closeMobileMenu() {
        setMobileMenu(false);
    }

    return (
        <nav className="navbar sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">

            <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">

                {/* =========================
                    TOP NAVBAR
                ========================= */}
                <div className="flex items-center justify-between min-h-16 gap-2">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 sm:gap-3 min-w-0 group"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <FiHome size={18} className="sm:w-5 sm:h-5" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                                City<span className="text-blue-600">Pulse</span>
                            </h1>

                            <p className="hidden sm:block text-[10px] text-slate-400 mt-1">
                                Better city. Better living.
                            </p>
                        </div>
                    </Link>


                    {/* =========================
                        DESKTOP NAVIGATION
                    ========================= */}
                    <div className="hidden md:flex items-center gap-1">

                        <Link
                            to="/"
                            className="px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className="px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                        >
                            <FiInfo size={16} />
                            About
                        </Link>

                        <Link
                            to="/contact"
                            className="px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                        >
                            <FiMail size={16} />
                            Contact
                        </Link>

                        {authUser && (
                            <>
                                <Link
                                    to="/complaints"
                                    className="px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Complaints
                                </Link>

                                <Link
                                    to="/services"
                                    className="px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Services
                                </Link>
                            </>
                        )}
                    </div>


                    {/* =========================
                        RIGHT SIDE
                    ========================= */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">

                        {authUser ? (
                            <>
                                {/* Notification */}
                                <button
                                    type="button"
                                    className="hidden sm:flex btn btn-ghost btn-circle text-slate-500 hover:text-blue-600"
                                >
                                    <FiBell size={19} />
                                </button>


                                {/* Desktop Profile */}
                                <div className="relative hidden sm:block">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfileMenu((current) => !current)
                                        }
                                        className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-xl hover:bg-slate-100"
                                    >
                                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
                                            <FiUser size={16} />
                                        </div>

                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {authUser.username || "User"}
                                            </p>

                                            <p className="text-xs text-slate-400 capitalize">
                                                {authUser.role || "user"}
                                            </p>
                                        </div>

                                        <FiChevronDown
                                            size={16}
                                            className={`text-slate-400 transition-transform ${profileMenu ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>


                                    {/* Profile Dropdown */}
                                    {profileMenu && (
                                        <div className="dropdown-content absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2">

                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <FiUser size={17} />
                                                Profile
                                            </Link>

                                            {authUser.role === "admin" && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setProfileMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <FiHome size={17} />
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <div className="border-t border-slate-100 my-1"></div>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <FiLogOut size={17} />
                                                Logout
                                            </button>

                                        </div>
                                    )}
                                </div>


                                {/* Mobile Menu Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenu((current) => !current)
                                    }
                                    className="md:hidden btn btn-ghost btn-circle w-10 h-10 min-h-10 text-slate-600"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenu ? (
                                        <FiX size={22} />
                                    ) : (
                                        <FiMenu size={22} />
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Desktop Login */}
                                <Link
                                    to="/login"
                                    className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <FiLogIn size={17} />
                                    Login
                                </Link>

                                {/* Get Started */}
                                <Link
                                    to="/register"
                                    className="btn btn-primary rounded-xl px-3 sm:px-5 min-h-10 h-10 text-xs sm:text-sm"
                                >
                                    <span className="hidden xs:inline">
                                        Get Started
                                    </span>
                                    <span className="xs:hidden">
                                        Register
                                    </span>
                                </Link>

                                {/* Mobile Menu */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenu((current) => !current)
                                    }
                                    className="md:hidden btn btn-ghost btn-circle w-10 h-10 min-h-10 text-slate-600"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenu ? (
                                        <FiX size={22} />
                                    ) : (
                                        <FiMenu size={22} />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>


                {/* =========================
                    MOBILE MENU
                ========================= */}
                {mobileMenu && (
                    <div className="md:hidden border-t border-slate-100 py-3">

                        <div className="flex flex-col gap-1">

                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <FiHome size={18} />
                                Home
                            </Link>

                            <Link
                                to="/about"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <FiInfo size={18} />
                                About
                            </Link>

                            <Link
                                to="/contact"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <FiMail size={18} />
                                Contact
                            </Link>

                            {authUser && (
                                <>
                                    <Link
                                        to="/complaints"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        Complaints
                                    </Link>

                                    <Link
                                        to="/services"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        Services
                                    </Link>

                                    <Link
                                        to="/profile"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <FiUser size={18} />
                                        Profile
                                    </Link>

                                    {authUser.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <FiHome size={18} />
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <div className="border-t border-slate-100 my-2"></div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <FiLogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            )}

                            {!authUser && (
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="flex sm:hidden items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <FiLogIn size={18} />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;