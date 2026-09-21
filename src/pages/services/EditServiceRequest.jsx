import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiFileText,
    FiMapPin,
    FiActivity,
    FiClock,
    FiAlertCircle,
    FiEdit3,
} from "react-icons/fi";

import Loading from "../../components/Loading";

import {
    getServiceById,
    updateServiceRequest,
} from "../../service/ServiceRequestService";

function EditServiceRequest() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        status: "pending",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadService();
    }, [id]);

    async function loadService() {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceById(id);

            setFormData({
                title: data.title || "",
                description: data.description || "",
                category: data.category || "",
                location: data.location || "",
                status: data.status || "pending",
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (formData.title.trim().length < 5) {
            toast.error(
                "Title must be at least 5 characters"
            );
            return;
        }

        if (formData.title.trim().length > 100) {
            toast.error(
                "Title must not exceed 100 characters"
            );
            return;
        }

        if (formData.description.trim().length < 10) {
            toast.error(
                "Description must be at least 10 characters"
            );
            return;
        }

        if (formData.description.trim().length > 1000) {
            toast.error(
                "Description must not exceed 1000 characters"
            );
            return;
        }

        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        if (formData.location.trim().length < 3) {
            toast.error(
                "Location must be at least 3 characters"
            );
            return;
        }

        if (formData.location.trim().length > 200) {
            toast.error(
                "Location must not exceed 200 characters"
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await updateServiceRequest(id, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                location: formData.location.trim(),
            });

            toast.success(
                "Service request updated successfully"
            );

            navigate(`/services/${id}`);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
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

    function getStatusClass(status) {
        const value = String(
            status || "pending"
        ).toLowerCase();

        if (value === "resolved") {
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        }

        if (value === "in_progress") {
            return "bg-sky-100 text-sky-700 border-sky-200";
        }

        if (value === "rejected") {
            return "bg-red-100 text-red-700 border-red-200";
        }

        return "bg-amber-100 text-amber-700 border-amber-200";
    }

    if (loading) {
        return <Loading />;
    }

    if (error && !formData.title) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-10">

                <div className="max-w-3xl mx-auto page-enter">

                    <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg p-5 sm:p-8 md:p-10 text-center">

                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">

                            <FiAlertCircle
                                size={25}
                                className="sm:hidden"
                            />

                            <FiAlertCircle
                                size={28}
                                className="hidden sm:block"
                            />

                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-4 sm:mt-5">
                            Unable to Load Service Request
                        </h1>

                        <p className="text-sm sm:text-base text-slate-500 mt-2 break-words">
                            {error}
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-4xl mx-auto page-enter">

                {/* =========================
                    BACK
                ========================= */}

                <Link
                    to={`/services/${id}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary transition mb-5 sm:mb-6"
                >
                    <FiArrowLeft size={16} />

                    Back to Service Request
                </Link>


                {/* =========================
                    MAIN CARD
                ========================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                    {/* Decorative Background */}

                    <div className="absolute -top-20 -right-20 sm:-top-32 sm:-right-32 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute -bottom-20 -left-20 sm:-bottom-32 sm:-left-32 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative">

                        {/* =========================
                            HEADER
                        ========================= */}

                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 sm:px-7 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 text-white">

                            <div className="flex items-center justify-between gap-4 sm:gap-5">

                                <div className="min-w-0">

                                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm mb-3 sm:mb-4">

                                        <FiEdit3 size={15} />

                                        Update Service

                                    </div>

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                                        Edit Service Request
                                    </h1>

                                    <p className="text-white/80 text-sm sm:text-base mt-2 max-w-xl leading-6">
                                        Update the information of your service request.
                                    </p>

                                </div>


                                {/* Header Icon */}

                                <div className="hidden sm:flex shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm items-center justify-center float-animation">

                                    <FiEdit3
                                        size={24}
                                        className="md:hidden"
                                    />

                                    <FiEdit3
                                        size={29}
                                        className="hidden md:block"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            FORM
                        ========================= */}

                        <div className="p-5 sm:p-7 md:p-8 lg:p-10">

                            {/* Error */}

                            {error && (
                                <div className="alert alert-error rounded-2xl mb-5 sm:mb-6 shadow-sm text-sm">

                                    <FiAlertCircle
                                        size={19}
                                        className="shrink-0"
                                    />

                                    <span className="break-words">
                                        {error}
                                    </span>

                                </div>
                            )}


                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 sm:space-y-6"
                            >

                                {/* =========================
                                    TITLE
                                ========================= */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        Request Title
                                    </label>

                                    <div className="relative">

                                        <FiFileText
                                            size={17}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                                        />

                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter service request title"
                                            className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={formData.title}
                                            onChange={handleChange}
                                            disabled={submitting}
                                            maxLength={100}
                                        />

                                    </div>

                                    <div className="flex items-center justify-between gap-3 mt-2">

                                        <p className="text-[11px] sm:text-xs text-slate-400">
                                            Minimum 5 characters
                                        </p>

                                        <p className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                            {formData.title.length}/100
                                        </p>

                                    </div>

                                </div>


                                {/* =========================
                                    CATEGORY + LOCATION
                                ========================= */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Category */}

                                    <div>

                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                            Category
                                        </label>

                                        <div className="relative">

                                            <FiActivity
                                                size={17}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none z-10"
                                            />

                                            <select
                                                name="category"
                                                className="select select-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.category}
                                                onChange={handleChange}
                                                disabled={submitting}
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                <option value="Roads & Potholes">
                                                    Roads & Potholes
                                                </option>

                                                <option value="Garbage & Waste">
                                                    Garbage & Waste
                                                </option>

                                                <option value="Street Lights">
                                                    Street Lights
                                                </option>

                                                <option value="Water & Drainage">
                                                    Water & Drainage
                                                </option>

                                                <option value="Public Safety">
                                                    Public Safety
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* Location */}

                                    <div>

                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                            Location
                                        </label>

                                        <div className="relative">

                                            <FiMapPin
                                                size={17}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
                                            />

                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="Enter service location"
                                                className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                maxLength={200}
                                            />

                                        </div>

                                        <div className="flex items-center justify-between mt-2">

                                            <p className="text-[11px] sm:text-xs text-slate-400">
                                                Minimum 3 characters
                                            </p>

                                            <p className="text-[11px] sm:text-xs text-slate-400">
                                                {formData.location.length}/200
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =========================
                                    STATUS
                                ========================= */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        Current Status
                                    </label>

                                    <div
                                        className={`flex items-center gap-3 w-full min-h-11 sm:min-h-12 px-3.5 sm:px-4 rounded-xl border font-semibold text-sm sm:text-base ${getStatusClass(
                                            formData.status
                                        )}`}
                                    >

                                        <FiClock
                                            size={17}
                                            className="shrink-0"
                                        />

                                        <span>
                                            {formatStatus(
                                                formData.status
                                            )}
                                        </span>

                                    </div>

                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2 leading-5">
                                        Status can only be changed by an administrator.
                                    </p>

                                </div>


                                {/* =========================
                                    DESCRIPTION
                                ========================= */}

                                <div>

                                    <div className="flex items-center justify-between gap-3 mb-2">

                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                            {formData.description.length}/1000
                                        </span>

                                    </div>

                                    <textarea
                                        name="description"
                                        placeholder="Describe the service you need..."
                                        className="textarea textarea-bordered w-full min-h-36 sm:min-h-40 md:min-h-44 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 leading-6 sm:leading-7 text-sm sm:text-base"
                                        value={formData.description}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        maxLength={1000}
                                    ></textarea>

                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                        Minimum 10 characters required
                                    </p>

                                </div>


                                {/* =========================
                                    INFORMATION
                                ========================= */}

                                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                                            <FiCheckCircle size={18} />

                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                                                Keep your information accurate
                                            </h3>

                                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-5 sm:leading-6">
                                                Make sure the location, category and description correctly represent your service request. Service status is managed by administrators.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =========================
                                    BUTTONS
                                ========================= */}

                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1 sm:pt-2">

                                    <Link
                                        to={`/services/${id}`}
                                        className="btn btn-outline rounded-xl flex-1 min-h-11 sm:min-h-12 text-sm sm:text-base hover:-translate-y-0.5"
                                    >

                                        <FiArrowLeft size={17} />

                                        Cancel

                                    </Link>


                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-xl flex-1 min-h-11 sm:min-h-12 text-sm sm:text-base shadow-md hover:-translate-y-0.5"
                                        disabled={submitting}
                                    >

                                        {submitting ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>

                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle size={18} />

                                                Update Request
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EditServiceRequest;