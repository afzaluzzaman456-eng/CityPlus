import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiFileText,
    FiMapPin,
    FiPlus,
    FiSearch,
    FiShield,
    FiAlertCircle,
} from "react-icons/fi";
import Loading from "../../components/Loading";
import { getComplaintById } from "../../service/ComplaintService";

function ComplaintDetails() {
    const { id } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadComplaint();
    }, [id]);

    async function loadComplaint() {
        try {
            setLoading(true);
            setError("");

            const data = await getComplaintById(id);

            setComplaint(data);
        } catch (error) {
            setError(error.message || "Failed to load complaint");
        } finally {
            setLoading(false);
        }
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

    function getStatusClass(status) {
        const value = (status || "pending").toLowerCase();

        if (value === "resolved") {
            return "badge-success";
        }

        if (value === "in_progress") {
            return "badge-info";
        }

        if (value === "rejected") {
            return "badge-error";
        }

        return "badge-warning";
    }

    function formatDate(date) {
        if (!date) {
            return "Date not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    if (loading) {
        return <Loading />;
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

                <div className="max-w-3xl mx-auto page-enter">

                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                        <div className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-44 h-44 sm:w-56 sm:h-56 bg-blue-200/40 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-20 sm:-bottom-24 -left-16 sm:-left-20 w-52 h-52 sm:w-64 sm:h-64 bg-cyan-200/30 rounded-full blur-3xl"></div>

                        <div className="relative text-center px-4 sm:px-8 md:px-10 py-12 sm:py-16">

                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 sm:mb-6 float-animation">
                                <FiFileText
                                    size={30}
                                    className="sm:w-[34px] sm:h-[34px]"
                                />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Complaint Not Found
                            </h1>

                            <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-lg mx-auto leading-6 sm:leading-7 break-words">
                                {error ||
                                    "The complaint you are looking for does not exist."}
                            </p>

                            <Link
                                to="/complaints"
                                className="btn btn-primary rounded-xl mt-6 sm:mt-7 px-5 sm:px-6 w-full sm:w-auto"
                            >
                                <FiArrowLeft size={18} />
                                Back to Complaints
                            </Link>

                        </div>

                    </div>

                </div>
            </div>
        );
    }

    const status = complaint.status || "pending";
    const normalizedStatus = status.toLowerCase();

    const priority = complaint.priority || "medium";

    const isReviewed =
        normalizedStatus === "in_progress" ||
        normalizedStatus === "resolved" ||
        normalizedStatus === "rejected";

    const isInProgress =
        normalizedStatus === "in_progress" ||
        normalizedStatus === "resolved";

    const isResolved = normalizedStatus === "resolved";

    const isRejected = normalizedStatus === "rejected";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-5xl mx-auto page-enter">

                {/* ================= BACK NAVIGATION ================= */}

                <Link
                    to="/complaints"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition mb-4 sm:mb-5"
                >
                    <FiArrowLeft size={17} />
                    Back to Complaints
                </Link>


                {/* ================= MAIN CARD ================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                    {/* Decorative Background */}

                    <div className="absolute -top-24 sm:-top-32 -right-24 sm:-right-32 w-64 h-64 sm:w-80 sm:h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute -bottom-24 sm:-bottom-32 -left-24 sm:-left-32 w-64 h-64 sm:w-80 sm:h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative">

                        {/* ================= HEADER ================= */}

                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 sm:px-7 md:px-8 lg:px-10 py-7 sm:py-8 md:py-10 text-white">

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 sm:gap-6">

                                <div className="max-w-3xl min-w-0">

                                    {/* Badges */}

                                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">

                                        <span className="badge bg-white/20 text-white border-white/30 backdrop-blur-sm px-2.5 sm:px-3 py-3 text-xs sm:text-sm">
                                            <FiFileText size={14} />
                                            Complaint
                                        </span>

                                        <span
                                            className={`badge ${getStatusClass(
                                                status
                                            )} border-0 px-2.5 sm:px-3 py-3 text-xs sm:text-sm`}
                                        >
                                            {formatStatus(status)}
                                        </span>

                                        <span className="badge bg-white/15 text-white border-white/20 px-2.5 sm:px-3 py-3 text-xs sm:text-sm max-w-full">
                                            <span className="truncate max-w-[180px] sm:max-w-none">
                                                {complaint.category}
                                            </span>
                                        </span>

                                    </div>


                                    {/* Title */}

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words">
                                        {complaint.title}
                                    </h1>

                                    <p className="mt-2 sm:mt-3 text-white/80 text-sm sm:text-base leading-6">
                                        Track the current progress and details of your complaint.
                                    </p>

                                </div>


                                {/* Shield */}

                                <div className="hidden md:flex w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/15 backdrop-blur-sm items-center justify-center border border-white/20 float-animation shrink-0">
                                    <FiShield
                                        size={27}
                                        className="lg:w-[30px] lg:h-[30px]"
                                    />
                                </div>

                            </div>

                        </div>


                        {/* ================= CONTENT ================= */}

                        <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                            {/* ================= INFORMATION CARDS ================= */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

                                {/* Category */}

                                <div className="group rounded-xl sm:rounded-2xl bg-blue-50/70 border border-blue-100 p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-start gap-3 sm:gap-4">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <FiFileText size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                                                Category
                                            </p>

                                            <p className="font-semibold text-sm sm:text-base text-slate-800 mt-1 break-words">
                                                {complaint.category}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Status */}

                                <div className="group rounded-xl sm:rounded-2xl bg-cyan-50/70 border border-cyan-100 p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-start gap-3 sm:gap-4">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <FiCheckCircle size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs uppercase tracking-wider font-semibold text-cyan-600">
                                                Status
                                            </p>

                                            <p className="font-semibold text-sm sm:text-base text-slate-800 mt-1 break-words">
                                                {formatStatus(status)}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Location */}

                                <div className="group rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-start gap-3 sm:gap-4">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <FiMapPin size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                                                Location
                                            </p>

                                            <p className="font-semibold text-sm sm:text-base text-slate-800 mt-1 break-words">
                                                {complaint.location}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Priority */}

                                <div className="group rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-100 p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

                                    <div className="flex items-start gap-3 sm:gap-4">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <FiAlertCircle size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs uppercase tracking-wider font-semibold text-amber-600">
                                                Priority
                                            </p>

                                            <p className="font-semibold text-sm sm:text-base text-slate-800 mt-1 capitalize">
                                                {priority}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Submitted Date */}

                                <div className="group rounded-xl sm:rounded-2xl bg-violet-50/70 border border-violet-100 p-4 sm:p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-2">

                                    <div className="flex items-start gap-3 sm:gap-4">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <FiCalendar size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs uppercase tracking-wider font-semibold text-violet-600">
                                                Submitted On
                                            </p>

                                            <p className="font-semibold text-sm sm:text-base text-slate-800 mt-1 break-words">
                                                {formatDate(complaint.created_at)}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* ================= DESCRIPTION ================= */}

                            <div className="mt-7 sm:mt-8">

                                <div className="flex items-center gap-3 mb-4">

                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <FiFileText size={18} />
                                    </div>

                                    <div className="min-w-0">

                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            Complaint Description
                                        </h2>

                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Details provided with this complaint
                                        </p>

                                    </div>

                                </div>

                                <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 md:p-6 hover:border-blue-200 transition">

                                    <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 whitespace-pre-line break-words">
                                        {complaint.description}
                                    </p>

                                </div>

                            </div>


                            {/* ================= STATUS TIMELINE ================= */}

                            <div className="mt-8 sm:mt-10">

                                <div className="flex items-center gap-3 mb-5 sm:mb-6">

                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                        <FiClock size={18} />
                                    </div>

                                    <div className="min-w-0">

                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            Complaint Status
                                        </h2>

                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Follow the progress of your complaint
                                        </p>

                                    </div>

                                </div>


                                <ul className="timeline timeline-vertical w-full">

                                    {/* ================= SUBMITTED ================= */}

                                    <li>

                                        <div className="timeline-start text-right font-semibold text-slate-700 text-xs sm:text-sm">
                                            Submitted
                                        </div>

                                        <div className="timeline-middle">

                                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>

                                        </div>

                                        <div className="timeline-end timeline-box bg-emerald-50 border-emerald-100 shadow-sm hover:shadow-md transition text-xs sm:text-sm max-w-[calc(100vw-100px)] sm:max-w-none">

                                            <div className="flex items-start sm:items-center gap-2">

                                                <FiCheckCircle className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />

                                                <span className="text-slate-700 break-words">
                                                    Complaint submitted successfully
                                                </span>

                                            </div>

                                        </div>

                                        <hr className="bg-emerald-300" />

                                    </li>


                                    {/* ================= REVIEWED ================= */}

                                    <li>

                                        <hr
                                            className={
                                                isReviewed
                                                    ? "bg-emerald-300"
                                                    : "bg-slate-200"
                                            }
                                        />

                                        <div className="timeline-start text-right font-semibold text-slate-700 text-xs sm:text-sm">
                                            Reviewed
                                        </div>

                                        <div className="timeline-middle">

                                            <div
                                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-4 ${isReviewed
                                                    ? "bg-emerald-500 ring-emerald-100"
                                                    : "bg-slate-300 ring-slate-100"
                                                    }`}
                                            ></div>

                                        </div>

                                        <div
                                            className={`timeline-end timeline-box shadow-sm transition text-xs sm:text-sm max-w-[calc(100vw-100px)] sm:max-w-none ${isReviewed
                                                ? "bg-emerald-50 border-emerald-100"
                                                : "bg-slate-50 border-slate-200"
                                                }`}
                                        >

                                            <div className="flex items-start sm:items-center gap-2">

                                                <FiSearch
                                                    className={`shrink-0 mt-0.5 sm:mt-0 ${isReviewed
                                                        ? "text-emerald-600"
                                                        : "text-slate-400"
                                                        }`}
                                                />

                                                <span className="text-slate-700 break-words">
                                                    Complaint reviewed by authority
                                                </span>

                                            </div>

                                        </div>

                                        <hr
                                            className={
                                                isReviewed
                                                    ? "bg-emerald-300"
                                                    : "bg-slate-200"
                                            }
                                        />

                                    </li>


                                    {/* ================= IN PROGRESS ================= */}

                                    <li>

                                        <hr
                                            className={
                                                isInProgress
                                                    ? "bg-emerald-300"
                                                    : "bg-slate-200"
                                            }
                                        />

                                        <div className="timeline-start text-right font-semibold text-slate-700 text-xs sm:text-sm">
                                            In Progress
                                        </div>

                                        <div className="timeline-middle">

                                            <div
                                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-4 ${isInProgress
                                                    ? "bg-emerald-500 ring-emerald-100"
                                                    : "bg-slate-300 ring-slate-100"
                                                    }`}
                                            ></div>

                                        </div>

                                        <div
                                            className={`timeline-end timeline-box shadow-sm transition text-xs sm:text-sm max-w-[calc(100vw-100px)] sm:max-w-none ${isInProgress
                                                ? "bg-emerald-50 border-emerald-100"
                                                : "bg-slate-50 border-slate-200"
                                                }`}
                                        >

                                            <div className="flex items-start sm:items-center gap-2">

                                                <FiClock
                                                    className={`shrink-0 mt-0.5 sm:mt-0 ${isInProgress
                                                        ? "text-emerald-600"
                                                        : "text-slate-400"
                                                        }`}
                                                />

                                                <span className="text-slate-700 break-words">
                                                    Work is being carried out
                                                </span>

                                            </div>

                                        </div>

                                        <hr
                                            className={
                                                isInProgress
                                                    ? "bg-emerald-300"
                                                    : "bg-slate-200"
                                            }
                                        />

                                    </li>


                                    {/* ================= RESOLVED ================= */}

                                    <li>

                                        <hr
                                            className={
                                                isResolved
                                                    ? "bg-emerald-300"
                                                    : "bg-slate-200"
                                            }
                                        />

                                        <div className="timeline-start text-right font-semibold text-slate-700 text-xs sm:text-sm">
                                            Resolved
                                        </div>

                                        <div className="timeline-middle">

                                            <div
                                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-4 ${isResolved
                                                    ? "bg-emerald-500 ring-emerald-100"
                                                    : "bg-slate-300 ring-slate-100"
                                                    }`}
                                            ></div>

                                        </div>

                                        <div
                                            className={`timeline-end timeline-box shadow-sm transition text-xs sm:text-sm max-w-[calc(100vw-100px)] sm:max-w-none ${isResolved
                                                ? "bg-emerald-50 border-emerald-100"
                                                : "bg-slate-50 border-slate-200"
                                                }`}
                                        >

                                            <div className="flex items-start sm:items-center gap-2">

                                                <FiCheckCircle
                                                    className={`shrink-0 mt-0.5 sm:mt-0 ${isResolved
                                                        ? "text-emerald-600"
                                                        : "text-slate-400"
                                                        }`}
                                                />

                                                <span className="text-slate-700 break-words">
                                                    Complaint issue resolved
                                                </span>

                                            </div>

                                        </div>

                                    </li>

                                </ul>

                            </div>


                            {/* ================= REJECTED NOTICE ================= */}

                            {isRejected && (
                                <div className="mt-7 sm:mt-8 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <FiAlertCircle size={19} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="font-semibold text-red-700 text-sm sm:text-base">
                                                Complaint Rejected
                                            </p>

                                            <p className="text-xs sm:text-sm text-red-600 mt-1 leading-5 break-words">
                                                This complaint has been marked as rejected by the
                                                responsible authority.
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}


                            {/* ================= CURRENT STATUS ================= */}

                            <div className="mt-7 sm:mt-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4 sm:p-5">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

                                    <div className="min-w-0">

                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Current Complaint Status
                                        </p>

                                        <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                                            {formatStatus(status)}
                                        </p>

                                    </div>

                                    <span
                                        className={`badge ${getStatusClass(
                                            status
                                        )} px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm self-start sm:self-auto`}
                                    >
                                        {formatStatus(status)}
                                    </span>

                                </div>

                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200">

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">

                                    <Link
                                        to="/complaints"
                                        className="btn btn-outline rounded-xl hover:-translate-y-0.5 w-full sm:w-full lg:w-auto"
                                    >
                                        <FiArrowLeft size={17} />
                                        Back to Complaints
                                    </Link>

                                    <Link
                                        to={`/complaints/${id}/edit`}
                                        className="btn btn-primary rounded-xl shadow-md hover:-translate-y-0.5 w-full sm:w-full lg:w-auto"
                                    >
                                        <FiEdit3 size={17} />
                                        Edit Complaint
                                    </Link>

                                    <Link
                                        to="/complaints/create"
                                        className="btn btn-secondary rounded-xl hover:-translate-y-0.5 w-full sm:w-full lg:w-auto"
                                    >
                                        <FiPlus size={17} />
                                        Create Another Complaint
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ComplaintDetails;