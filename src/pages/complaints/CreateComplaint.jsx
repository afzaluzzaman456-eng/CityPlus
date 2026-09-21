import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiCheckCircle,
    FiFileText,
    FiMapPin,
    FiSend,
} from "react-icons/fi";
import { createComplaint } from "../../service/ComplaintService";

function CreateComplaint() {
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        const title = formData.title.trim();
        const location = formData.location.trim();
        const description = formData.description.trim();

        if (title.length < 5) {
            toast.error("Complaint title must be at least 5 characters");
            return;
        }

        if (title.length > 100) {
            toast.error("Complaint title must be less than 100 characters");
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

        if (description.length < 10) {
            toast.error("Description must be at least 10 characters");
            return;
        }

        if (description.length > 1000) {
            toast.error("Description must be less than 1000 characters");
            return;
        }

        setLoading(true);

        try {
            await createComplaint({
                title,
                category: formData.category,
                location,
                description,
            });

            toast.success("Complaint submitted successfully!");

            setTimeout(() => {
                navigate("/complaints");
            }, 800);
        } catch (error) {
            setError(error.message || "Failed to create complaint");
            toast.error(
                error.message || "Failed to create complaint"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            {/* Background Decorations */}

            <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 md:-top-40 md:-right-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-blue-200/30 blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 md:-bottom-40 md:-left-40 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cyan-200/30 blur-3xl"></div>

            <div className="absolute top-28 left-5 sm:top-32 sm:left-8 md:left-10 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400/40 float-animation"></div>

            <div className="absolute bottom-28 right-8 sm:bottom-32 sm:right-12 md:right-16 w-2 h-2 rounded-full bg-cyan-400/50 float-animation"></div>

            <div className="relative max-w-4xl mx-auto page-enter">

                {/* Header */}

                <div className="mb-6 sm:mb-8">

                    <Link
                        to="/complaints"
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-cyan-600 transition-colors"
                    >
                        <FiArrowLeft size={15} className="sm:w-4 sm:h-4" />
                        Back to Complaints
                    </Link>

                    <div className="flex items-start sm:items-center gap-3 mt-4 sm:mt-5">

                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <FiFileText size={19} className="sm:w-[21px] sm:h-[21px]" />
                        </div>

                        <div className="min-w-0">

                            <p className="text-xs sm:text-sm font-semibold text-blue-600">
                                Citizen Report
                            </p>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 break-words">
                                Create Complaint
                            </h1>

                        </div>

                    </div>

                    <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-2xl leading-6">
                        Report a problem in your city and help make your
                        community safer, cleaner and better.
                    </p>

                </div>

                {/* Form Card */}

                <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-city-lg border border-white overflow-hidden">

                    {/* Card Header */}

                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 sm:px-7 md:px-8 py-5 sm:py-6 text-white">

                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">

                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                                <FiSend size={19} className="sm:w-[22px] sm:h-[22px]" />
                            </div>

                            <div className="min-w-0">

                                <h2 className="text-lg sm:text-xl font-bold break-words">
                                    Report a City Problem
                                </h2>

                                <p className="text-xs sm:text-sm text-white/75 mt-1 leading-5">
                                    Provide accurate information so it can be reviewed quickly.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="p-4 sm:p-6 md:p-8">

                        {/* Error */}

                        {error && (
                            <div className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-5 sm:mb-6">

                                <FiAlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0 sm:w-5 sm:h-5"
                                />

                                <div className="min-w-0">

                                    <p className="text-sm sm:text-base font-semibold">
                                        Unable to submit complaint
                                    </p>

                                    <p className="text-xs sm:text-sm mt-1 break-words leading-5">
                                        {error}
                                    </p>

                                </div>

                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 sm:space-y-6"
                        >

                            {/* Title */}

                            <div>

                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                    Complaint Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Large pothole near main road"
                                    className="input input-bordered w-full min-h-11 sm:min-h-12 text-sm sm:text-base rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                    value={formData.title}
                                    onChange={handleChange}
                                    minLength={5}
                                    maxLength={100}
                                    required
                                />

                                <p className="text-[11px] sm:text-xs text-slate-400 mt-2 leading-4">
                                    Minimum 5 characters, maximum 100 characters.
                                </p>

                            </div>

                            {/* Category + Location */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                                {/* Category */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        className="select select-bordered w-full min-h-11 sm:min-h-12 text-sm sm:text-base rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
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

                                {/* Location */}

                                <div>

                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                                        Location
                                    </label>

                                    <div className="relative">

                                        <FiMapPin
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-blue-500"
                                            size={17}
                                        />

                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Enter problem location"
                                            className="input input-bordered w-full min-h-11 sm:min-h-12 pl-10 sm:pl-11 text-sm sm:text-base rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                            value={formData.location}
                                            onChange={handleChange}
                                            minLength={3}
                                            maxLength={200}
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* Description */}

                            <div>

                                <div className="flex items-start sm:items-center justify-between gap-3 mb-2">

                                    <label className="text-xs sm:text-sm font-semibold text-slate-700">
                                        Description
                                    </label>

                                    <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                        {formData.description.length}/1000
                                    </span>

                                </div>

                                <textarea
                                    name="description"
                                    placeholder="Describe the problem in detail. Mention what happened, where it happened and any important information..."
                                    className="textarea textarea-bordered w-full min-h-36 sm:min-h-40 md:min-h-44 text-sm sm:text-base rounded-xl bg-slate-50 border-slate-200 focus:bg-white leading-6"
                                    value={formData.description}
                                    onChange={handleChange}
                                    minLength={10}
                                    maxLength={1000}
                                    required
                                ></textarea>

                                <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                    Minimum 10 characters.
                                </p>

                            </div>

                            {/* Information Box */}

                            <div className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100">

                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <FiCheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-xs sm:text-sm font-semibold text-blue-700">
                                        Helpful reporting tip
                                    </p>

                                    <p className="text-[11px] sm:text-xs text-blue-600 mt-1 leading-5 break-words">
                                        Include a clear location and enough details so the
                                        responsible team can understand and review the issue.
                                    </p>

                                </div>

                            </div>

                            {/* Divider */}

                            <div className="border-t border-slate-100 pt-5 sm:pt-6"></div>

                            {/* Buttons */}

                            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">

                                <Link
                                    to="/complaints"
                                    className="btn w-full sm:w-32 min-h-11 sm:min-h-12 rounded-xl bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-sm sm:text-base"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="btn w-full sm:flex-1 min-h-11 sm:min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 text-sm sm:text-base"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend size={17} className="sm:w-[18px] sm:h-[18px]" />
                                            Submit Complaint
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {/* Bottom Note */}

                <div className="flex items-start sm:items-center justify-center gap-2 mt-4 sm:mt-5 text-[11px] sm:text-xs text-slate-400 text-center px-2">

                    <FiCheckCircle
                        size={13}
                        className="shrink-0 mt-0.5 sm:mt-0"
                    />

                    <span className="leading-5">
                        Your complaint will be reviewed by the CityPulse team.
                    </span>

                </div>

            </div>

        </div>
    );
}

export default CreateComplaint;