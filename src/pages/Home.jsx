import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiCheckCircle,
    FiMapPin,
    FiSearch,
    FiShield,
    FiBell,
    FiUser,
    FiEdit3,
    FiActivity,
} from "react-icons/fi";

function Home() {
    return (
        <div className="min-h-screen bg-base-200 overflow-hidden">

            {/* ================================
                Hero Section
            ================================= */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">

                {/* Background Decorations */}
                <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-80 sm:h-80 bg-white/10 rounded-full blur-3xl"></div>

                <div className="absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-20 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>

                <div className="absolute top-20 right-1/3 w-3 h-3 bg-white/40 rounded-full float-animation"></div>

                <div className="absolute top-40 right-8 sm:right-20 w-2 h-2 bg-white/50 rounded-full float-animation"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-28">

                    <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">

                        {/* =========================
                            Left Side
                        ========================== */}
                        <div className="page-enter">

                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-5 sm:mb-6">

                                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>

                                <span className="text-xs sm:text-sm font-medium">
                                    Better City, Better Life
                                </span>

                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">

                                Make Your City

                                <br />

                                <span className="text-cyan-200">
                                    Better Together
                                </span>

                            </h1>

                            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/80 max-w-xl leading-7 sm:leading-8">

                                Report problems in your city, share your concerns,
                                and help make your community cleaner, safer, and better
                                for everyone.

                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-7 sm:mt-8">

                                <Link
                                    to="/complaints/create"
                                    className="btn w-full sm:w-auto bg-white text-blue-700 border-none hover:bg-cyan-50 hover:-translate-y-1 shadow-lg shadow-blue-900/20 px-4 sm:px-5"
                                >
                                    <FiEdit3 size={18} />

                                    <span>
                                        Report a Complaint
                                    </span>

                                    <FiArrowRight size={17} />
                                </Link>

                                <Link
                                    to="/complaints"
                                    className="btn w-full sm:w-auto btn-outline border-white/60 text-white hover:bg-white hover:text-blue-700 hover:border-white px-4 sm:px-5"
                                >
                                    Explore Complaints
                                </Link>

                            </div>

                            {/* Small Trust Items */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 lg:gap-6 mt-7 sm:mt-8 text-sm text-white/70">

                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-cyan-200 shrink-0" />
                                    <span>Easy Reporting</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiActivity className="text-cyan-200 shrink-0" />
                                    <span>Track Progress</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiShield className="text-cyan-200 shrink-0" />
                                    <span>Secure Access</span>
                                </div>

                            </div>

                        </div>

                        {/* =========================
                            Right Side
                        ========================== */}
                        <div className="flex justify-center lg:justify-end">

                            <div className="relative w-full max-w-md float-animation">

                                {/* Glow */}
                                <div className="absolute inset-0 bg-cyan-300/30 blur-3xl rounded-full"></div>

                                {/* Main Card */}
                                <div className="relative card bg-white/95 backdrop-blur-xl text-base-content shadow-2xl border border-white/50">

                                    <div className="card-body p-4 sm:p-6 md:p-7">

                                        {/* Icon */}
                                        <div className="flex justify-center mb-4 sm:mb-5">

                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">

                                                <FiMapPin
                                                    size={32}
                                                    className="sm:w-[38px] sm:h-[38px]"
                                                />

                                            </div>

                                        </div>

                                        <div className="text-center">

                                            <h2 className="text-xl sm:text-2xl font-bold">
                                                Your Voice Matters
                                            </h2>

                                            <p className="text-sm sm:text-base text-base-content/60 mt-2 leading-6">

                                                Help improve your community by reporting
                                                issues that need attention.

                                            </p>

                                        </div>

                                        {/* Process */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 sm:mt-7">

                                            {/* Report */}
                                            <div className="group text-center p-3 sm:p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:-translate-y-1">

                                                <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center">

                                                    <FiEdit3 size={19} />

                                                </div>

                                                <div className="font-semibold mt-2 sm:mt-3 text-sm">
                                                    Report
                                                </div>

                                                <div className="text-xs text-base-content/50 mt-1">
                                                    City Issues
                                                </div>

                                            </div>

                                            {/* Track */}
                                            <div className="group text-center p-3 sm:p-4 rounded-2xl bg-cyan-50 hover:bg-cyan-100 transition-all duration-300 hover:-translate-y-1">

                                                <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl bg-cyan-600 text-white flex items-center justify-center">

                                                    <FiSearch size={19} />

                                                </div>

                                                <div className="font-semibold mt-2 sm:mt-3 text-sm">
                                                    Track
                                                </div>

                                                <div className="text-xs text-base-content/50 mt-1">
                                                    Progress
                                                </div>

                                            </div>

                                            {/* Resolve */}
                                            <div className="group text-center p-3 sm:p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all duration-300 hover:-translate-y-1">

                                                <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center">

                                                    <FiCheckCircle size={19} />

                                                </div>

                                                <div className="font-semibold mt-2 sm:mt-3 text-sm">
                                                    Resolve
                                                </div>

                                                <div className="text-xs text-base-content/50 mt-1">
                                                    Get Results
                                                </div>

                                            </div>

                                        </div>

                                        {/* Bottom Status */}
                                        <div className="mt-5 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-base-200 flex items-center gap-3">

                                            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-success/10 text-success flex items-center justify-center">

                                                <FiActivity size={18} />

                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-sm font-semibold">
                                                    Stay Connected
                                                </p>

                                                <p className="text-xs text-base-content/50 truncate">
                                                    Follow your reports anytime
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================
                How It Works
            ================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

                <div className="text-center mb-9 sm:mb-12">

                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-4 text-sm">

                        <FiActivity size={15} />

                        Simple Process

                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        How CityPulse Works
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-base-content/60 max-w-2xl mx-auto leading-6 sm:leading-7">

                        A simple way for citizens to report problems and
                        stay informed about their progress.

                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                    {/* Report */}
                    <div className="group card bg-base-100 border border-blue-100 shadow-city hover:shadow-city-lg">

                        <div className="card-body p-5 sm:p-6">

                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">

                                <FiEdit3 size={23} />

                            </div>

                            <h3 className="text-lg sm:text-xl font-bold mt-4">
                                Report
                            </h3>

                            <p className="text-sm sm:text-base text-base-content/60 leading-6">

                                Submit complaints about roads, waste, lighting,
                                drainage, safety, and other city issues.

                            </p>

                        </div>

                    </div>

                    {/* Track */}
                    <div className="group card bg-base-100 border border-cyan-100 shadow-city hover:shadow-city-lg">

                        <div className="card-body p-5 sm:p-6">

                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">

                                <FiSearch size={23} />

                            </div>

                            <h3 className="text-lg sm:text-xl font-bold mt-4">
                                Track
                            </h3>

                            <p className="text-sm sm:text-base text-base-content/60 leading-6">

                                Follow the status of your submitted complaints
                                and service requests from your account.

                            </p>

                        </div>

                    </div>

                    {/* Resolve */}
                    <div className="group card bg-base-100 border border-emerald-100 shadow-city hover:shadow-city-lg">

                        <div className="card-body p-5 sm:p-6">

                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">

                                <FiCheckCircle size={23} />

                            </div>

                            <h3 className="text-lg sm:text-xl font-bold mt-4">
                                Resolve
                            </h3>

                            <p className="text-sm sm:text-base text-base-content/60 leading-6">

                                Stay updated as authorities review and work
                                toward resolving reported issues.

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================
                Platform Features
            ================================= */}
            <section className="relative bg-white border-y border-base-200 overflow-hidden">

                <div className="absolute -right-20 sm:-right-32 top-20 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-blue-100/50 blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

                    <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">

                        {/* Text */}
                        <div>

                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-5 text-sm">

                                <FiShield size={15} />

                                CityPulse Platform

                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">

                                One Platform for a{" "}

                                <span className="gradient-text">
                                    Better City
                                </span>

                            </h2>

                            <p className="text-sm sm:text-base text-base-content/60 mt-4 leading-6 sm:leading-7 max-w-xl">

                                CityPulse connects citizens with city service
                                management through a simple and transparent platform.

                            </p>

                            <div className="mt-6 sm:mt-7 flex items-center gap-3 text-sm text-base-content/60">

                                <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

                                    <FiCheckCircle size={17} />

                                </div>

                                <span>
                                    Built for citizens and communities
                                </span>

                            </div>

                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                            {/* Location */}
                            <div className="group p-5 sm:p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">

                                    <FiMapPin size={20} />

                                </div>

                                <h3 className="font-bold">
                                    Location Based
                                </h3>

                                <p className="text-sm text-base-content/60 mt-2 leading-5">
                                    Provide the location of the reported issue.
                                </p>

                            </div>

                            {/* Updates */}
                            <div className="group p-5 sm:p-6 rounded-2xl bg-cyan-50 border border-cyan-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-4">

                                    <FiBell size={20} />

                                </div>

                                <h3 className="font-bold">
                                    Status Updates
                                </h3>

                                <p className="text-sm text-base-content/60 mt-2 leading-5">
                                    Follow complaint and service request progress.
                                </p>

                            </div>

                            {/* Profile */}
                            <div className="group p-5 sm:p-6 rounded-2xl bg-violet-50 border border-violet-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-4">

                                    <FiUser size={20} />

                                </div>

                                <h3 className="font-bold">
                                    Citizen Profile
                                </h3>

                                <p className="text-sm text-base-content/60 mt-2 leading-5">
                                    Manage your complaints and service requests.
                                </p>

                            </div>

                            {/* Security */}
                            <div className="group p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">

                                    <FiShield size={20} />

                                </div>

                                <h3 className="font-bold">
                                    Secure Access
                                </h3>

                                <p className="text-sm text-base-content/60 mt-2 leading-5">
                                    Protected accounts with role-based access.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================
                CTA Section
            ================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white p-6 sm:p-8 md:p-12 text-center shadow-city-lg">

                    {/* Background */}
                    <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="absolute -bottom-20 -left-12 sm:-bottom-24 sm:-left-16 w-56 h-56 sm:w-72 sm:h-72 bg-cyan-300/10 rounded-full blur-3xl"></div>

                    <div className="relative">

                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 sm:mb-6">

                            <FiMapPin size={27} />

                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">

                            Have a Problem in Your Area?

                        </h2>

                        <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-6">

                            Report it through CityPulse and help make your
                            community a better place.

                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-7">

                            <Link
                                to="/complaints/create"
                                className="btn w-full sm:w-auto bg-white text-blue-700 border-none hover:bg-cyan-50 hover:-translate-y-1"
                            >
                                <FiEdit3 size={18} />
                                Report a Complaint
                            </Link>

                            <Link
                                to="/services/create"
                                className="btn w-full sm:w-auto btn-outline border-white/70 text-white hover:bg-white hover:text-blue-700"
                            >
                                Request a Service
                                <FiArrowRight size={17} />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;