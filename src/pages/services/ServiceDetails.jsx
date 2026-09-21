import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FiArrowLeft,
    FiActivity,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiFileText,
    FiMapPin,
    FiTrash2,
    FiAlertCircle,
} from "react-icons/fi";

import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";

import {
    deleteServiceRequest,
    getServiceById,
} from "../../service/ServiceRequestService";

function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadService();
    }, [id]);

    async function loadService() {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceById(id);

            setService(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function openDeleteModal() {
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        if (!deleting) {
            setShowDeleteModal(false);
        }
    }

    async function handleDelete() {
        try {
            setDeleting(true);
            setError("");

            await deleteServiceRequest(id);

            toast.success(
                "Service request deleted successfully"
            );

            setShowDeleteModal(false);

            navigate("/services");
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    }

    function getStatusClass(status) {
        const value = String(
            status || "pending"
        ).toLowerCase();

        if (value === "resolved") {
            return "badge-success";
        }

        if (value.includes("progress")) {
            return "badge-info";
        }

        if (value === "rejected") {
            return "badge-error";
        }

        return "badge-warning";
    }

    function getStatusIcon(status) {
        const value = String(
            status || "pending"
        ).toLowerCase();

        if (value === "resolved") {
            return <FiCheckCircle size={18} />;
        }

        if (value.includes("progress")) {
            return <FiActivity size={18} />;
        }

        return <FiClock size={18} />;
    }

    function formatStatus(status) {
        if (!status) {
            return "Pending";
        }

        if (status.toLowerCase() === "in_progress") {
            return "In Progress";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase()
        );
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-10">

                <div className="max-w-4xl mx-auto page-enter">

                    <div className="rounded-2xl sm:rounded-3xl bg-white border border-red-100 shadow-city-lg p-5 sm:p-8">

                        <div className="flex items-start gap-3 sm:gap-4">

                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">

                                <FiAlertCircle
                                    size={21}
                                    className="sm:hidden"
                                />

                                <FiAlertCircle
                                    size={22}
                                    className="hidden sm:block"
                                />

                            </div>

                            <div className="min-w-0">

                                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                                    Unable to Load Service Request
                                </h2>

                                <p className="text-sm sm:text-base text-slate-500 mt-1 break-words">
                                    {error}
                                </p>

                            </div>

                        </div>

                        <Link
                            to="/services"
                            className="btn btn-outline rounded-xl mt-5 sm:mt-6 text-sm sm:text-base"
                        >
                            <FiArrowLeft size={17} />
                            Back to Services
                        </Link>

                    </div>

                </div>

            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-10">

                <div className="max-w-4xl mx-auto text-center page-enter">

                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-city-lg p-6 sm:p-10">

                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">

                            <FiFileText
                                size={25}
                                className="sm:hidden"
                            />

                            <FiFileText
                                size={28}
                                className="hidden sm:block"
                            />

                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-4 sm:mt-5">
                            Service Request Not Found
                        </h1>

                        <p className="text-sm sm:text-base text-slate-500 mt-2">
                            The requested service request could not be found.
                        </p>

                        <Link
                            to="/services"
                            className="btn btn-primary rounded-xl mt-5 sm:mt-6 text-sm sm:text-base"
                        >
                            <FiArrowLeft size={17} />
                            Back to Services
                        </Link>

                    </div>

                </div>

            </div>
        );
    }

    const status = service.status || "pending";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-4xl mx-auto page-enter">

                {/* =========================
                    BACK
                ========================= */}

                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary transition"
                >
                    <FiArrowLeft size={16} />

                    Back to Services
                </Link>


                {/* =========================
                    MAIN CARD
                ========================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg mt-4 sm:mt-5">

                    {/* Decorative Background */}

                    <div className="absolute -top-20 -right-20 sm:-top-32 sm:-right-32 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute -bottom-20 -left-20 sm:-bottom-32 sm:-left-32 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative">

                        {/* =========================
                            HEADER
                        ========================= */}

                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 sm:px-7 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 text-white">

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 sm:gap-6">

                                <div className="max-w-2xl min-w-0">

                                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm mb-3 sm:mb-4">

                                        <FiActivity size={15} />

                                        Service Request

                                    </div>

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words">
                                        {service.title ||
                                            "Untitled Request"}
                                    </h1>

                                    <div className="flex items-start sm:items-center gap-2 mt-3 text-white/80 text-sm sm:text-base">

                                        <FiFileText
                                            size={16}
                                            className="shrink-0 mt-0.5 sm:mt-0"
                                        />

                                        <span className="break-words">
                                            {service.category ||
                                                "General Service"}
                                        </span>

                                    </div>

                                </div>


                                {/* Status */}

                                <div
                                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white shadow-sm self-start shrink-0 ${
                                        status.toLowerCase() ===
                                        "resolved"
                                            ? "text-green-600"
                                            : status
                                                .toLowerCase()
                                                .includes(
                                                    "progress"
                                                )
                                                ? "text-blue-600"
                                                : status
                                                    .toLowerCase() ===
                                                  "rejected"
                                                    ? "text-red-600"
                                                    : "text-amber-600"
                                    }`}
                                >
                                    {getStatusIcon(status)}

                                    {formatStatus(status)}
                                </div>

                            </div>

                        </div>


                        {/* =========================
                            CONTENT
                        ========================= */}

                        <div className="p-5 sm:p-7 md:p-8 lg:p-10">

                            {/* =========================
                                QUICK INFO
                            ========================= */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">

                                {/* Location */}

                                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                                            <FiMapPin size={19} />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">
                                                Location
                                            </p>

                                            <p className="text-sm sm:text-base font-semibold text-slate-800 mt-1 break-words">
                                                {service.location ||
                                                    "Location not available"}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Submitted Date */}

                                <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">

                                            <FiCalendar size={19} />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">
                                                Submitted On
                                            </p>

                                            <p className="text-sm sm:text-base font-semibold text-slate-800 mt-1 break-words">
                                                {service.created_at
                                                    ? new Date(
                                                        service.created_at
                                                    ).toLocaleString()
                                                    : "Date not available"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =========================
                                DESCRIPTION
                            ========================= */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">

                                <div className="flex items-center gap-3 mb-3 sm:mb-4">

                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm shrink-0">

                                        <FiFileText size={18} />

                                    </div>

                                    <h2 className="font-bold text-base sm:text-lg text-slate-800">
                                        Description
                                    </h2>

                                </div>

                                <p className="text-sm sm:text-base text-slate-600 leading-6 sm:leading-7 whitespace-pre-line break-words">
                                    {service.description ||
                                        "No description available."}
                                </p>

                            </div>


                            {/* =========================
                                STATUS INFORMATION
                            ========================= */}

                            <div className="mt-5 sm:mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 p-4 sm:p-6">

                                <div className="flex items-center gap-3 mb-3 sm:mb-4">

                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-cyan-600 flex items-center justify-center shadow-sm shrink-0">

                                        {getStatusIcon(status)}

                                    </div>

                                    <div className="min-w-0">

                                        <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                            Current Status
                                        </h2>

                                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                            Latest service request progress
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center">

                                    <span
                                        className={`badge ${getStatusClass(
                                            status
                                        )} gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm min-h-9 sm:min-h-10`}
                                    >
                                        {getStatusIcon(status)}

                                        {formatStatus(status)}
                                    </span>

                                </div>

                                <p className="text-[11px] sm:text-xs text-slate-400 mt-3">
                                    Status is managed by administrators.
                                </p>

                            </div>


                            {/* =========================
                                ACTIONS
                            ========================= */}

                            <div className="border-t border-slate-200 mt-6 sm:mt-8 pt-5 sm:pt-6">

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                    <Link
                                        to="/services"
                                        className="btn btn-outline rounded-xl min-h-11 sm:min-h-12 text-sm sm:text-base"
                                    >
                                        <FiArrowLeft size={17} />

                                        Back
                                    </Link>

                                    <Link
                                        to={`/services/${id}/edit`}
                                        className="btn btn-primary rounded-xl min-h-11 sm:min-h-12 text-sm sm:text-base shadow-md hover:-translate-y-0.5"
                                    >
                                        <FiEdit3 size={17} />

                                        Edit Request
                                    </Link>

                                    <button
                                        onClick={openDeleteModal}
                                        className="btn btn-error rounded-xl min-h-11 sm:min-h-12 text-sm sm:text-base hover:-translate-y-0.5"
                                        disabled={deleting}
                                    >
                                        {deleting ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <FiTrash2 size={17} />
                                                Delete Request
                                            </>
                                        )}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                DELETE CONFIRMATION MODAL
            ========================= */}

            <ConfirmModal
                open={showDeleteModal}
                title="Delete Service Request"
                message="Are you sure you want to delete this service request? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={closeDeleteModal}
                loading={deleting}
            />

        </div>
    );
}

export default ServiceDetails;