import { Link, useLocation } from "react-router-dom";
import {
    FiHome,
    FiFileText,
    FiTool,
    FiUser,
    FiShield,
    FiClipboard,
} from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
    const location = useLocation();
    const { authUser } = useContext(AuthContext);

    const isAdmin = authUser?.role === "admin";

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="hidden lg:flex w-56 xl:w-64 min-h-screen shrink-0 bg-white border-r border-slate-200 px-3 xl:px-5 py-5 xl:py-6 flex-col">

            {/* Logo */}
            <div className="mb-6 xl:mb-8 px-1 xl:px-2">
                <Link
                    to="/"
                    className="flex items-center gap-2 group"
                >
                    <div className="w-9 h-9 xl:w-10 xl:h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
                        <FiShield size={18} />
                    </div>

                    <div className="text-xl xl:text-2xl font-bold truncate">
                        <span className="text-blue-600">
                            City
                        </span>

                        <span className="text-slate-800">
                            Pulse
                        </span>
                    </div>
                </Link>
            </div>


            {/* Main Menu */}
            <div>
                <p className="px-2 xl:px-3 mb-3 text-[10px] xl:text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Main Menu
                </p>

                <ul className="space-y-1">

                    {/* Home */}
                    <li>
                        <Link
                            to="/"
                            className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                isActive("/")
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            <FiHome size={18} className="shrink-0" />
                            <span className="truncate">Home</span>
                        </Link>
                    </li>


                    {/* Complaints */}
                    <li>
                        <Link
                            to="/complaints"
                            className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                isActive("/complaints")
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            <FiFileText size={18} className="shrink-0" />
                            <span className="truncate">Complaints</span>
                        </Link>
                    </li>


                    {/* My Complaints */}
                    <li>
                        <Link
                            to="/complaints/my"
                            className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                isActive("/complaints/my")
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            <FiClipboard size={18} className="shrink-0" />
                            <span className="truncate">My Complaints</span>
                        </Link>
                    </li>


                    {/* Services */}
                    <li>
                        <Link
                            to="/services"
                            className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                isActive("/services")
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            <FiTool size={18} className="shrink-0" />
                            <span className="truncate">Services</span>
                        </Link>
                    </li>


                    {/* Profile */}
                    <li>
                        <Link
                            to="/profile"
                            className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                isActive("/profile")
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                            <FiUser size={18} className="shrink-0" />
                            <span className="truncate">My Profile</span>
                        </Link>
                    </li>

                </ul>
            </div>


            {/* Admin Menu */}
            {isAdmin && (
                <div className="mt-6 xl:mt-8">

                    <div className="divider my-2"></div>

                    <p className="px-2 xl:px-3 mb-3 text-[10px] xl:text-xs font-semibold uppercase tracking-wider text-orange-400">
                        Administration
                    </p>

                    <ul className="space-y-1">

                        {/* Admin Dashboard */}
                        <li>
                            <Link
                                to="/admin"
                                className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                    isActive("/admin")
                                        ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20"
                                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                <FiShield size={18} className="shrink-0" />
                                <span className="truncate">Admin Dashboard</span>
                            </Link>
                        </li>


                        {/* Manage Complaints */}
                        <li>
                            <Link
                                to="/admin/complaints"
                                className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                    isActive("/admin/complaints")
                                        ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20"
                                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                <FiFileText size={18} className="shrink-0" />
                                <span className="truncate">Manage Complaints</span>
                            </Link>
                        </li>


                        {/* Manage Services */}
                        <li>
                            <Link
                                to="/admin/services"
                                className={`flex items-center gap-2.5 xl:gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl font-medium text-sm xl:text-base transition-all duration-300 ${
                                    isActive("/admin/services")
                                        ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20"
                                        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                <FiTool size={18} className="shrink-0" />
                                <span className="truncate">Manage Services</span>
                            </Link>
                        </li>

                    </ul>
                </div>
            )}


            {/* Bottom Info */}
            <div className="mt-auto pt-5 xl:pt-6">

                <div className="p-3 xl:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">

                    <div className="flex items-center gap-2 mb-2">

                        <div className="w-7 h-7 xl:w-8 xl:h-8 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center">
                            <FiShield size={14} />
                        </div>

                        <span className="text-sm font-semibold text-slate-700 truncate">
                            CityPulse
                        </span>

                    </div>

                    <p className="text-[11px] xl:text-xs leading-5 text-slate-500">
                        Help make your city better by reporting issues and tracking progress.
                    </p>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;