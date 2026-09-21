import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FiArrowLeft,
    FiMapPin,
    FiCheckCircle,
    FiFileText,
    FiActivity,
    FiSend,
    FiAlertCircle,
} from "react-icons/fi";

import { createServiceRequest } from "../../service/ServiceRequestService";

function CreateServiceRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        const title = formData.title.trim();
        const location = formData.location.trim();
        const description = formData.description.trim();

        if (title.length < 5) {
            toast.error(
                "Request title must be at least 5 characters"
            );
            return;
        }

        if (title.length > 100) {
            toast.error(
                "Request title must not exceed 100 characters"
            );
            return;
        }

        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        if (location.length < 3) {
            toast.error("Please enter a valid location");
            return;
        }

        if (location.length > 200) {
            toast.error(
                "Location must not exceed 200 characters"
            );
            return;
        }

        if (description.length < 10) {
            toast.error(
                "Description must be at least 10 characters"
            );
            return;
        }

        if (description.length > 1000) {
            toast.error(
                "Description must not exceed 1000 characters"
            );
            return;
        }

        setLoading(true);

        try {
            await createServiceRequest({
                title,
                category: formData.category,
                location,
                description,
            });

            toast.success(
                "Service request submitted successfully!"
            );

            setTimeout(() => {
                navigate("/services");
            }, 800);
        } catch (error) {
            const message =
                error.message ||
                "Failed to create service request";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-4xl mx-auto page-enter">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-5 sm:mb-6">

                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary transition"
                    >
                        <FiArrowLeft
                            size={16}
                            className="shrink-0"
                        />

                        <span>Back to Services</span>
                    </Link>

                </div>


                {/* =========================
                    MAIN CARD
                ========================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                    {/* Decorative Background */}

                    <div className="absolute -top-20 -right-20 sm:-top-32 sm:-right-32 w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute -bottom-20 -left-20 sm:-bottom-32 sm:-left-32 w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none"></div>


                    <div className="relative">

                        {/* =========================
                            HERO HEADER
                        ========================= */}

                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 sm:px-7 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 text-white">

                            <div className="flex items-center justify-between gap-4 sm:gap-5">

                                <div className="min-w-0">

                                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm mb-3 sm:mb-4">

                                        <FiActivity
                                            size={15}
                                            className="shrink-0"
                                        />

                                        <span>City Service</span>

                                    </div>


                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words">
                                        Create Service Request
                                    </h1>


                                    <p className="text-white/80 text-xs sm:text-sm md:text-base mt-2 max-w-xl leading-5 sm:leading-6">
                                        Request a city service and track its progress easily.
                                    </p>

                                </div>


                                {/* Header Icon */}

                                <div className="hidden sm:flex shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm items-center justify-center float-animation">

                                    <FiSend
                                        size={23}
                                        className="md:hidden"
                                    />

                                    <FiSend
                                        size={29}
                                        className="hidden md:block"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            FORM AREA
                        ========================= */}

                        <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                            {/* Error */}

                            {error && (
                                <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-5 sm:mb-6">

                                    <FiAlertCircle
                                        size={19}
                                        className="shrink-0 mt-0.5"
                                    />

                                    <span className="text-xs sm:text-sm break-words min-w-0">
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
                                            className="input input-bordered w-full pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={formData.title}
                                            onChange={handleChange}
                                            minLength={5}
                                            maxLength={100}
                                            required
                                            disabled={loading}
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
                                                className="select select-bordered w-full pl-10 sm:pl-11 pr-3 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            >

                                                <option value="">
                                                    Select a category
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
                                                className="input input-bordered w-full pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.location}
                                                onChange={handleChange}
                                                minLength={3}
                                                maxLength={200}
                                                required
                                                disabled={loading}
                                            />

                                        </div>


                                        <div className="flex items-center justify-between gap-3 mt-2">

                                            <p className="text-[11px] sm:text-xs text-slate-400">
                                                Minimum 3 characters
                                            </p>

                                            <p className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                                {formData.location.length}/200
                                            </p>

                                        </div>

                                    </div>

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
                                        minLength={10}
                                        maxLength={1000}
                                        required
                                        disabled={loading}
                                    ></textarea>


                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                        Minimum 10 characters required
                                    </p>

                                </div>


                                {/* =========================
                                    INFORMATION BOX
                                ========================= */}

                                <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                                            <FiCheckCircle
                                                size={18}
                                            />

                                        </div>


                                        <div className="min-w-0">

                                            <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                                                Before submitting
                                            </h3>

                                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-5 sm:leading-6 break-words">
                                                Make sure the service category, location and description accurately explain what you need.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =========================
                                    BUTTONS
                                ========================= */}

                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1 sm:pt-2">

                                    <Link
                                        to="/services"
                                        className="btn btn-outline rounded-xl w-full sm:w-auto sm:min-w-32 min-h-11 sm:min-h-12 text-sm sm:text-base hover:-translate-y-0.5"
                                    >

                                        <FiArrowLeft
                                            size={17}
                                        />

                                        Cancel

                                    </Link>


                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-xl w-full sm:flex-1 min-h-11 sm:min-h-12 text-sm sm:text-base shadow-md hover:-translate-y-0.5"
                                        disabled={loading}
                                    >

                                        {loading ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>

                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle size={18} />

                                                <span>
                                                    Submit Service Request
                                                </span>
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

export default CreateServiceRequest;