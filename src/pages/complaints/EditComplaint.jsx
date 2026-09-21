import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiFileText,
    FiMapPin,
    FiFlag,
    FiActivity,
    FiAlertCircle,
} from "react-icons/fi";

import Loading from "../../components/Loading";
import {
    getComplaintById,
    updateComplaint,
} from "../../service/ComplaintService";

function EditComplaint() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "medium",
        status: "pending",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadComplaint();
    }, [id]);

    async function loadComplaint() {
        try {
            setLoading(true);
            setError("");

            const data = await getComplaintById(id);

            setFormData({
                title: data.title || "",
                description: data.description || "",
                category: data.category || "",
                location: data.location || "",
                priority: data.priority || "medium",
                status: data.status || "pending",
            });
        } catch (error) {
            setError(error.message || "Failed to load complaint");
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

        const title = formData.title.trim();
        const description = formData.description.trim();
        const location = formData.location.trim();

        if (title.length < 5) {
            toast.error("Title must be at least 5 characters");
            return;
        }

        if (title.length > 100) {
            toast.error("Title must be less than 100 characters");
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

        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        if (location.length < 3) {
            toast.error("Location must be at least 3 characters");
            return;
        }

        if (location.length > 200) {
            toast.error("Location must be less than 200 characters");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await updateComplaint(id, {
                ...formData,
                title,
                description,
                location,
            });

            toast.success("Complaint updated successfully");

            navigate(`/complaints/${id}`);
        } catch (error) {
            setError(error.message || "Failed to update complaint");
            toast.error(error.message || "Failed to update complaint");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (error && !formData.title) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-3 sm:px-5 md:px-6 py-6 sm:py-10 md:py-12">

                <div className="max-w-3xl mx-auto page-enter">

                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                        <div className="absolute -top-20 sm:-top-24 -right-20 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-blue-200/40 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-20 sm:-bottom-24 -left-20 sm:-left-24 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-200/30 rounded-full blur-3xl"></div>

                        <div className="relative text-center px-5 sm:px-8 md:px-10 py-12 sm:py-16">

                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-5 sm:mb-6 float-animation">
                                <FiAlertCircle size={30} className="sm:hidden" />
                                <FiAlertCircle size={36} className="hidden sm:block" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Unable to Load Complaint
                            </h1>

                            <p className="text-sm sm:text-base text-slate-500 mt-3 max-w-lg mx-auto break-words">
                                {error}
                            </p>

                            <Link
                                to="/complaints"
                                className="btn btn-primary rounded-xl mt-6 sm:mt-7 px-5 sm:px-6 text-sm sm:text-base"
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/50 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-4xl mx-auto page-enter">

                {/* Back Navigation */}

                <Link
                    to={`/complaints/${id}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition mb-4 sm:mb-5"
                >
                    <FiArrowLeft size={16} className="sm:w-[17px] sm:h-[17px]" />
                    Back to Complaint
                </Link>

                {/* Main Card */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                    {/* Decorative Background */}

                    <div className="absolute -top-24 sm:-top-32 -right-24 sm:-right-32 w-56 h-56 sm:w-80 sm:h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute -bottom-24 sm:-bottom-32 -left-24 sm:-left-32 w-56 h-56 sm:w-80 sm:h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative">

                        {/* Header */}

                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 sm:px-7 md:px-8 lg:px-10 py-6 sm:py-8 md:py-9 text-white">

                            <div className="flex items-center justify-between gap-4 sm:gap-5">

                                <div className="min-w-0">

                                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm mb-3 sm:mb-4">
                                        <FiFileText size={15} className="sm:w-4 sm:h-4" />
                                        Complaint Management
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
                                        Edit Complaint
                                    </h1>

                                    <p className="text-white/80 mt-2 text-xs sm:text-sm md:text-base">
                                        Update the information of your complaint.
                                    </p>

                                </div>

                                <div className="hidden sm:flex shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm items-center justify-center float-animation">
                                    <FiFileText size={26} className="md:hidden" />
                                    <FiFileText size={30} className="hidden md:block" />
                                </div>

                            </div>

                        </div>

                        {/* Form Area */}

                        <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                            {/* Error */}

                            {error && (
                                <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-5 sm:mb-6">

                                    <FiAlertCircle
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span className="text-sm sm:text-base break-words min-w-0">
                                        {error}
                                    </span>

                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 sm:space-y-6"
                            >

                                {/* Title */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Complaint Title
                                    </label>

                                    <div className="relative">

                                        <FiFileText
                                            size={18}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                                        />

                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Enter complaint title"
                                            className="input input-bordered w-full pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={formData.title}
                                            onChange={handleChange}
                                            minLength={5}
                                            maxLength={100}
                                            disabled={submitting}
                                            required
                                        />

                                    </div>

                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                        Minimum 5 characters, maximum 100 characters.
                                    </p>

                                </div>

                                {/* Category + Location */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Category */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Category
                                        </label>

                                        <div className="relative">

                                            <FiFileText
                                                size={18}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none z-10"
                                            />

                                            <select
                                                name="category"
                                                className="select select-bordered w-full pl-10 sm:pl-11 pr-3 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.category}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                required
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

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Location
                                        </label>

                                        <div className="relative">

                                            <FiMapPin
                                                size={18}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
                                            />

                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="Enter complaint location"
                                                className="input input-bordered w-full pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.location}
                                                onChange={handleChange}
                                                minLength={3}
                                                maxLength={200}
                                                disabled={submitting}
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Priority + Status */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Priority */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Priority
                                        </label>

                                        <div className="relative">

                                            <FiFlag
                                                size={18}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none z-10"
                                            />

                                            <select
                                                name="priority"
                                                className="select select-bordered w-full pl-10 sm:pl-11 pr-3 rounded-xl bg-slate-100 border-slate-200 text-slate-500 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.priority}
                                                disabled
                                            >
                                                <option value="low">
                                                    Low
                                                </option>

                                                <option value="medium">
                                                    Medium
                                                </option>

                                                <option value="high">
                                                    High
                                                </option>

                                            </select>

                                        </div>

                                        <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                            Priority is managed by the authority.
                                        </p>

                                    </div>

                                    {/* Status */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Status
                                        </label>

                                        <div className="relative">

                                            <FiActivity
                                                size={18}
                                                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-violet-500 pointer-events-none z-10"
                                            />

                                            <select
                                                name="status"
                                                className="select select-bordered w-full pl-10 sm:pl-11 pr-3 rounded-xl bg-slate-100 border-slate-200 text-slate-500 text-sm sm:text-base min-h-11 sm:min-h-12"
                                                value={formData.status}
                                                disabled
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="in_progress">
                                                    In Progress
                                                </option>

                                                <option value="resolved">
                                                    Resolved
                                                </option>

                                                <option value="rejected">
                                                    Rejected
                                                </option>

                                            </select>

                                        </div>

                                        <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                            Status is managed by the authority.
                                        </p>

                                    </div>

                                </div>

                                {/* Description */}

                                <div>

                                    <div className="flex items-start sm:items-center justify-between gap-3 mb-2">

                                        <label className="block text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                            {formData.description.length}/1000
                                        </span>

                                    </div>

                                    <textarea
                                        name="description"
                                        placeholder="Describe the problem..."
                                        className="textarea textarea-bordered w-full min-h-36 sm:min-h-40 md:min-h-44 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 leading-6 sm:leading-7 text-sm sm:text-base"
                                        value={formData.description}
                                        onChange={handleChange}
                                        minLength={10}
                                        maxLength={1000}
                                        disabled={submitting}
                                        required
                                    ></textarea>

                                    <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
                                        Minimum 10 characters, maximum 1000 characters.
                                    </p>

                                </div>

                                {/* Form Summary */}

                                <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4 sm:p-5">

                                    <div className="flex items-start gap-3">

                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <FiCheckCircle size={18} className="sm:hidden" />
                                            <FiCheckCircle size={19} className="hidden sm:block" />
                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                                                Ready to update?
                                            </h3>

                                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-5 sm:leading-6">
                                                Make sure the complaint information is correct
                                                before submitting the changes. Priority and status
                                                are managed by the responsible authority.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Buttons */}

                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1 sm:pt-2">

                                    <Link
                                        to={`/complaints/${id}`}
                                        className="btn btn-outline rounded-xl w-full sm:flex-1 hover:-translate-y-0.5 text-sm sm:text-base min-h-11 sm:min-h-12"
                                    >
                                        <FiArrowLeft size={17} />
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-xl w-full sm:flex-1 shadow-md hover:-translate-y-0.5 text-sm sm:text-base min-h-11 sm:min-h-12"
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
                                                Update Complaint
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

export default EditComplaint;