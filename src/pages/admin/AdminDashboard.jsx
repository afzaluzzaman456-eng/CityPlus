import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiAlertCircle,
    FiClock,
    FiCheckCircle,
    FiFileText,
    FiRefreshCw,
    FiSettings,
    FiArrowRight,
    FiTool,
    FiShield,
    FiActivity,
} from "react-icons/fi";

import { getAllComplaints } from "../../service/ComplaintService";
import { getAllServices } from "../../service/ServiceRequestService";
import Loading from "../../components/Loading";

function AdminDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            setLoading(true);
            setError("");

            const [complaintData, serviceData] = await Promise.all([
                getAllComplaints(),
                getAllServices(),
            ]);

            setComplaints(
                Array.isArray(complaintData) ? complaintData : []
            );

            setServices(
                Array.isArray(serviceData) ? serviceData : []
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function getStatus(item) {
        return item.status || "Pending";
    }

    function getStatusClass(status) {
        const value = status.toLowerCase();

        if (value.includes("resolved") || value.includes("completed")) {
            return "badge-success";
        }

        if (value.includes("progress")) {
            return "badge-info";
        }

        if (value.includes("reject")) {
            return "badge-error";
        }

        return "badge-warning";
    }

    function formatStatus(status) {
        if (!status) {
            return "Pending";
        }

        if (status.toLowerCase() === "in_progress") {
            return "In Progress";
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Complaint Statistics
    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (complaint) =>
            getStatus(complaint).toLowerCase() === "pending"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) =>
            getStatus(complaint).toLowerCase().includes("progress")
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) =>
            getStatus(complaint).toLowerCase().includes("resolved")
    ).length;

    // Service Statistics
    const totalServices = services.length;

    const pendingServices = services.filter(
        (service) =>
            getStatus(service).toLowerCase() === "pending"
    ).length;

    const inProgressServices = services.filter(
        (service) =>
            getStatus(service).toLowerCase().includes("progress")
    ).length;

    const completedServices = services.filter(
        (service) => {
            const status = getStatus(service).toLowerCase();

            return (
                status.includes("completed") ||
                status.includes("resolved")
            );
        }
    ).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-7xl mx-auto page-enter">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 text-white p-5 sm:p-7 md:p-8 lg:p-10 mb-6 sm:mb-8 shadow-city-lg">

                    <div className="absolute -top-20 -right-20 sm:-top-24 sm:-right-24 w-52 h-52 sm:w-72 sm:h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-24 sm:-bottom-32 left-1/3 w-60 h-60 sm:w-80 sm:h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-7">

                        <div className="min-w-0">

                            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-xs sm:text-sm mb-3 sm:mb-4">

                                <FiShield
                                    size={15}
                                    className="shrink-0"
                                />

                                <span>CityPulse Administration</span>

                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
                                Admin Dashboard
                            </h1>

                            <p className="text-white/70 mt-2 text-sm sm:text-base max-w-2xl leading-6">
                                Monitor citizen complaints and service requests from one
                                centralized dashboard.
                            </p>

                        </div>


                        {/* Header Buttons */}

                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 sm:gap-3 w-full lg:w-auto">

                            <Link
                                to="/admin/complaints"
                                className="btn w-full sm:flex-1 lg:w-auto bg-white text-blue-700 border-none hover:bg-blue-50 rounded-xl shadow-sm text-sm sm:text-base"
                            >
                                <FiFileText size={18} />
                                Complaints
                            </Link>

                            <Link
                                to="/admin/services"
                                className="btn w-full sm:flex-1 lg:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl text-sm sm:text-base"
                            >
                                <FiSettings size={18} />
                                Services
                            </Link>

                        </div>

                    </div>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (
                    <div className="rounded-2xl bg-white border border-red-200 shadow-sm p-4 sm:p-5 mb-6 sm:mb-8">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div className="flex items-start gap-3 text-red-600 min-w-0">

                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                    <FiAlertCircle size={20} />
                                </div>

                                <span className="font-medium text-sm sm:text-base break-words pt-2">
                                    {error}
                                </span>

                            </div>

                            <button
                                onClick={loadDashboardData}
                                className="btn btn-sm btn-error rounded-xl w-full sm:w-auto"
                            >
                                <FiRefreshCw size={16} />
                                Retry
                            </button>

                        </div>

                    </div>
                )}


                {loading ? (
                    <Loading />
                ) : (
                    <>

                        {/* =========================
                            COMPLAINT OVERVIEW
                        ========================= */}

                        <section>

                            <div className="flex items-center gap-3 mb-4 sm:mb-5">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <FiFileText size={20} />
                                </div>

                                <div className="min-w-0">

                                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                                        Complaint Overview
                                    </h2>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Current complaint activity
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                                {/* Total */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="min-w-0">

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Total Complaints
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1.5 sm:mt-2">
                                                {totalComplaints}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiFileText size={21} className="sm:hidden" />
                                            <FiFileText size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* Pending */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Pending
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 mt-1.5 sm:mt-2">
                                                {pendingComplaints}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiClock size={21} className="sm:hidden" />
                                            <FiClock size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* In Progress */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                In Progress
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-600 mt-1.5 sm:mt-2">
                                                {inProgressComplaints}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiActivity size={21} className="sm:hidden" />
                                            <FiActivity size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* Resolved */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Resolved
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1.5 sm:mt-2">
                                                {resolvedComplaints}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiCheckCircle size={21} className="sm:hidden" />
                                            <FiCheckCircle size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            SERVICE OVERVIEW
                        ========================= */}

                        <section className="mt-8 sm:mt-10">

                            <div className="flex items-center gap-3 mb-4 sm:mb-5">

                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                    <FiTool size={20} />
                                </div>

                                <div className="min-w-0">

                                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                                        Service Request Overview
                                    </h2>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Current service request activity
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                                {/* Total */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Total Requests
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1.5 sm:mt-2">
                                                {totalServices}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiTool size={21} className="sm:hidden" />
                                            <FiTool size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* Pending */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Pending
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 mt-1.5 sm:mt-2">
                                                {pendingServices}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiClock size={21} className="sm:hidden" />
                                            <FiClock size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* In Progress */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                In Progress
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-600 mt-1.5 sm:mt-2">
                                                {inProgressServices}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiActivity size={21} className="sm:hidden" />
                                            <FiActivity size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>


                                {/* Completed */}

                                <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-center justify-between gap-3">

                                        <div>

                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Completed
                                            </p>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1.5 sm:mt-2">
                                                {completedServices}
                                            </h2>

                                        </div>

                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                            <FiCheckCircle size={21} className="sm:hidden" />
                                            <FiCheckCircle size={23} className="hidden sm:block" />
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            MANAGEMENT CARDS
                        ========================= */}

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mt-8 sm:mt-10">

                            {/* Complaint Management */}

                            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-5 sm:p-6 md:p-7 shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <div className="absolute -right-12 -top-12 sm:-right-16 sm:-top-16 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/10"></div>

                                <div className="relative">

                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 sm:mb-5">
                                        <FiFileText size={22} className="sm:hidden" />
                                        <FiFileText size={24} className="hidden sm:block" />
                                    </div>

                                    <h2 className="text-lg sm:text-xl font-bold">
                                        Complaint Management
                                    </h2>

                                    <p className="text-white/70 mt-2 text-sm sm:text-base leading-6">
                                        Review complaints, update their status, and manage
                                        citizen reports from the administration panel.
                                    </p>

                                    <Link
                                        to="/admin/complaints"
                                        className="btn w-full sm:w-auto bg-white text-blue-700 border-none hover:bg-blue-50 rounded-xl mt-5 sm:mt-6 text-sm sm:text-base"
                                    >
                                        View Complaints
                                        <FiArrowRight size={18} />
                                    </Link>

                                </div>

                            </div>


                            {/* Service Management */}

                            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-5 sm:p-6 md:p-7 shadow-lg hover:-translate-y-1 transition-all duration-300">

                                <div className="absolute -right-12 -top-12 sm:-right-16 sm:-top-16 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/10"></div>

                                <div className="relative">

                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 sm:mb-5">
                                        <FiSettings size={22} className="sm:hidden" />
                                        <FiSettings size={24} className="hidden sm:block" />
                                    </div>

                                    <h2 className="text-lg sm:text-xl font-bold break-words">
                                        Service Request Management
                                    </h2>

                                    <p className="text-white/70 mt-2 text-sm sm:text-base leading-6">
                                        Review service requests, update status, and manage
                                        citizen service needs efficiently.
                                    </p>

                                    <Link
                                        to="/admin/services"
                                        className="btn w-full sm:w-auto bg-white text-cyan-700 border-none hover:bg-cyan-50 rounded-xl mt-5 sm:mt-6 text-sm sm:text-base"
                                    >
                                        Manage Services
                                        <FiArrowRight size={18} />
                                    </Link>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            RECENT COMPLAINTS
                        ========================= */}

                        <section className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm mt-8 sm:mt-10 overflow-hidden">

                            <div className="p-4 sm:p-6 md:p-7">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div className="min-w-0">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FiFileText size={19} />
                                            </div>

                                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                                                Recent Complaints
                                            </h2>

                                        </div>

                                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                                            Latest complaints submitted by citizens.
                                        </p>

                                    </div>

                                    <Link
                                        to="/admin/complaints"
                                        className="btn btn-sm btn-outline rounded-xl w-full sm:w-auto"
                                    >
                                        View All
                                        <FiArrowRight size={16} />
                                    </Link>

                                </div>


                                <div className="divider"></div>


                                {complaints.length === 0 ? (
                                    <div className="text-center py-10 sm:py-12">

                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                            <FiFileText size={25} />
                                        </div>

                                        <p className="text-sm sm:text-base text-slate-500 mt-4">
                                            No complaints available.
                                        </p>

                                    </div>
                                ) : (
                                    <div className="space-y-3">

                                        {complaints
                                            .slice(-5)
                                            .reverse()
                                            .map((complaint, index) => {

                                                const status = getStatus(complaint);

                                                const complaintId =
                                                    complaint.id ||
                                                    complaint.complaint_id;

                                                return (
                                                    <div
                                                        key={complaintId || index}
                                                        className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 p-3.5 sm:p-4 hover:bg-blue-50/60 hover:border-blue-100 transition-all duration-300"
                                                    >

                                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">

                                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm shrink-0">
                                                                <FiFileText size={17} />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <h3 className="font-semibold text-sm sm:text-base text-slate-800 break-words line-clamp-2">
                                                                    {complaint.title ||
                                                                        "Untitled Complaint"}
                                                                </h3>

                                                                <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">
                                                                    {complaint.category ||
                                                                        "General"}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto">

                                                            <span
                                                                className={`badge text-xs sm:text-sm ${getStatusClass(
                                                                    status
                                                                )}`}
                                                            >
                                                                {formatStatus(status)}
                                                            </span>

                                                            {complaintId && (
                                                                <Link
                                                                    to={`/complaints/${complaintId}`}
                                                                    className="btn btn-sm btn-ghost rounded-lg text-xs sm:text-sm"
                                                                >
                                                                    View
                                                                    <FiArrowRight size={14} />
                                                                </Link>
                                                            )}

                                                        </div>

                                                    </div>
                                                );
                                            })}

                                    </div>
                                )}

                            </div>

                        </section>


                        {/* =========================
                            RECENT SERVICE REQUESTS
                        ========================= */}

                        <section className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm mt-6 sm:mt-8 overflow-hidden">

                            <div className="p-4 sm:p-6 md:p-7">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div className="min-w-0">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                                                <FiTool size={19} />
                                            </div>

                                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                                                Recent Service Requests
                                            </h2>

                                        </div>

                                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                                            Latest service requests submitted by citizens.
                                        </p>

                                    </div>

                                    <Link
                                        to="/admin/services"
                                        className="btn btn-sm btn-outline rounded-xl w-full sm:w-auto"
                                    >
                                        View All
                                        <FiArrowRight size={16} />
                                    </Link>

                                </div>


                                <div className="divider"></div>


                                {services.length === 0 ? (
                                    <div className="text-center py-10 sm:py-12">

                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                            <FiTool size={25} />
                                        </div>

                                        <p className="text-sm sm:text-base text-slate-500 mt-4">
                                            No service requests available.
                                        </p>

                                    </div>
                                ) : (
                                    <div className="space-y-3">

                                        {services
                                            .slice(-5)
                                            .reverse()
                                            .map((service, index) => {

                                                const status = getStatus(service);

                                                const serviceId =
                                                    service.id ||
                                                    service.service_id;

                                                return (
                                                    <div
                                                        key={serviceId || index}
                                                        className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 p-3.5 sm:p-4 hover:bg-cyan-50/60 hover:border-cyan-100 transition-all duration-300"
                                                    >

                                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">

                                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-cyan-600 flex items-center justify-center shadow-sm shrink-0">
                                                                <FiTool size={17} />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <h3 className="font-semibold text-sm sm:text-base text-slate-800 break-words line-clamp-2">
                                                                    {service.title ||
                                                                        "Untitled Service Request"}
                                                                </h3>

                                                                <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">
                                                                    {service.category ||
                                                                        "General"}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto">

                                                            <span
                                                                className={`badge text-xs sm:text-sm ${getStatusClass(
                                                                    status
                                                                )}`}
                                                            >
                                                                {formatStatus(status)}
                                                            </span>

                                                            {serviceId && (
                                                                <Link
                                                                    to={`/services/${serviceId}`}
                                                                    className="btn btn-sm btn-ghost rounded-lg text-xs sm:text-sm"
                                                                >
                                                                    View
                                                                    <FiArrowRight size={14} />
                                                                </Link>
                                                            )}

                                                        </div>

                                                    </div>
                                                );
                                            })}

                                    </div>
                                )}

                            </div>

                        </section>

                    </>
                )}

            </div>

        </div>
    );
}

export default AdminDashboard;