import { Link } from "react-router-dom";
import {
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiYoutube,
    FiArrowRight,
    FiMapPin,
    FiMail,
} from "react-icons/fi";

function Footer() {
    return (
        <footer className="relative bg-slate-950 text-white overflow-hidden">

            {/* Background Decorations */}

            <div className="absolute -top-20 sm:-top-28 lg:-top-32 -right-20 sm:-right-28 lg:-right-32 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 sm:-bottom-32 lg:-bottom-40 -left-20 sm:-left-24 lg:-left-32 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>


            {/* Main Footer */}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14 lg:py-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14 xl:gap-16">


                    {/* ================================
                        Brand
                    ================================= */}

                    <div className="sm:col-span-2 lg:col-span-1">

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 group"
                        >

                            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">

                                <FiMapPin size={19} />

                            </div>


                            <div className="text-xl sm:text-2xl font-bold">

                                <span className="text-blue-400">
                                    City
                                </span>

                                <span className="text-white">
                                    Pulse
                                </span>

                            </div>

                        </Link>


                        <p className="mt-4 sm:mt-5 text-sm leading-6 sm:leading-7 text-slate-400 max-w-sm">

                            Your voice can make a difference. Report city
                            problems, track progress, and help build a better
                            community together.

                        </p>


                        {/* Social Icons */}

                        <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 sm:mt-7">

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300"
                            >
                                <FiFacebook size={16} />
                            </a>


                            <a
                                href="#"
                                aria-label="Twitter"
                                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-600 hover:-translate-y-1 transition-all duration-300"
                            >
                                <FiTwitter size={16} />
                            </a>


                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300"
                            >
                                <FiLinkedin size={16} />
                            </a>


                            <a
                                href="#"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:-translate-y-1 transition-all duration-300"
                            >
                                <FiYoutube size={16} />
                            </a>

                        </div>

                    </div>


                    {/* ================================
                        Platform
                    ================================= */}

                    <div>

                        <h6 className="font-bold text-base mb-4 sm:mb-5 text-white">
                            Platform
                        </h6>


                        <div className="flex flex-col gap-3 sm:gap-4 text-sm text-slate-400">

                            <Link
                                to="/"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Home
                            </Link>


                            <Link
                                to="/complaints"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Browse Complaints
                            </Link>


                            <Link
                                to="/register"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Create Account
                            </Link>


                            <Link
                                to="/login"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Login
                            </Link>

                        </div>

                    </div>


                    {/* ================================
                        Report Issues
                    ================================= */}

                    <div>

                        <h6 className="font-bold text-base mb-4 sm:mb-5 text-white">
                            Report Issues
                        </h6>


                        <div className="flex flex-col gap-3 sm:gap-4 text-sm text-slate-400">

                            <Link
                                to="/complaints/create"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Roads & Potholes
                            </Link>


                            <Link
                                to="/complaints/create"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Garbage & Waste
                            </Link>


                            <Link
                                to="/complaints/create"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Street Lights
                            </Link>


                            <Link
                                to="/complaints/create"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Water & Drainage
                            </Link>


                            <Link
                                to="/complaints/create"
                                className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                            >
                                Public Safety
                            </Link>

                        </div>

                    </div>


                    {/* ================================
                        Stay Connected
                    ================================= */}

                    <div className="sm:col-span-2 lg:col-span-1">

                        <h6 className="font-bold text-base mb-4 sm:mb-5 text-white">
                            Stay Connected
                        </h6>


                        <p className="text-sm leading-6 text-slate-400 mb-4 sm:mb-5 max-w-md lg:max-w-none">

                            Get updates about your community and
                            important city issues.

                        </p>


                        <form
                            onSubmit={(e) => e.preventDefault()}
                        >

                            <div className="flex w-full min-w-0 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 focus-within:border-blue-500 transition-colors">

                                <div className="pl-3 sm:pl-3.5 flex items-center text-slate-500 shrink-0">

                                    <FiMail size={17} />

                                </div>


                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="input input-sm sm:input-md bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none w-full min-w-0"
                                />


                                <button
                                    type="submit"
                                    className="btn btn-sm sm:btn-md bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white rounded-none shrink-0 px-4 sm:px-5 hover:from-blue-500 hover:to-cyan-400"
                                >
                                    Join
                                </button>

                            </div>

                        </form>


                        <p className="text-xs text-slate-500 mt-3">
                            No spam. Only useful updates.
                        </p>


                        <div className="mt-5 sm:mt-6 flex items-start gap-2 text-xs leading-5 text-slate-500">

                            <span className="w-2 h-2 mt-1.5 shrink-0 bg-emerald-400 rounded-full animate-pulse"></span>

                            <span>
                                CityPulse is here to serve your community
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================
                Bottom Footer
            ================================= */}

            <div className="relative border-t border-slate-800">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">


                        <p className="text-xs sm:text-sm text-slate-500 text-center md:text-left">

                            © 2026 CityPulse. All rights reserved.

                        </p>


                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">

                            <a
                                href="#"
                                className="hover:text-cyan-400 transition-colors"
                            >
                                Privacy
                            </a>


                            <a
                                href="#"
                                className="hover:text-cyan-400 transition-colors"
                            >
                                Terms
                            </a>


                            <a
                                href="#"
                                className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                            >
                                Help Center
                                <FiArrowRight size={13} />
                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;