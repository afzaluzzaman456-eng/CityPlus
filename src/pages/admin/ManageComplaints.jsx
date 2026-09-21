import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FiArrowLeft,
    FiSearch,
    FiRefreshCw,
    FiEye,
    FiTrash2,
    FiFilter,
    FiFileText,
    FiCalendar,
    FiMapPin,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiX,
    FiFlag,
} from "react-icons/fi";

import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";

import {
    getAllComplaints,
    deleteComplaint,
    updateComplaintPriority,
    updateComplaintStatus,
} from "../../service/ComplaintService";

function ManageComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [statusLoading, setStatusLoading] = useState(null);
    const [priorityLoading, setPriorityLoading] = useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    async function loadComplaints(showRefresh = false) {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getAllComplaints();

            setComplaints(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadComplaints();
    }, []);

    useEffect(() => {
        let result = [...complaints];

        if (search.trim()) {
            const searchValue = search.toLowerCase().trim();

            result = result.filter((complaint) => {
                const id = String(
                    complaint.id || complaint.complaint_id || ""
                ).toLowerCase();

                const title = String(
                    complaint.title || ""
                ).toLowerCase();

                const description = String(
                    complaint.description || ""
                ).toLowerCase();

                const category = String(
                    complaint.category || ""
                ).toLowerCase();

                const location = String(
                    complaint.location || ""
                ).toLowerCase();

                return (
                    id.includes(searchValue) ||
                    title.includes(searchValue) ||
                    description.includes(searchValue) ||
                    category.includes(searchValue) ||
                    location.includes(searchValue)
                );
            });
        }

        if (statusFilter) {
            result = result.filter(
                (complaint) =>
                    String(complaint.status || "pending").toLowerCase() ===
                    statusFilter.toLowerCase()
            );
        }

        if (priorityFilter) {
            result = result.filter(
                (complaint) =>
                    String(complaint.priority || "medium").toLowerCase() ===
                    priorityFilter.toLowerCase()
            );
        }

        if (categoryFilter) {
            result = result.filter(
                (complaint) =>
                    String(complaint.category || "").toLowerCase() ===
                    categoryFilter.toLowerCase()
            );
        }

        setFilteredComplaints(result);
    }, [
        complaints,
        search,
        statusFilter,
        priorityFilter,
        categoryFilter,
    ]);

    async function handleStatusChange(id, status) {
        try {
            setStatusLoading(id);
            setError("");

            await updateComplaintStatus(id, status);

            setComplaints((currentComplaints) =>
                currentComplaints.map((complaint) => {
                    const complaintId =
                        complaint.id || complaint.complaint_id;

                    if (complaintId === id) {
                        return {
                            ...complaint,
                            status: status,
                        };
                    }

                    return complaint;
                })
            );

            toast.success("Complaint status updated successfully");
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setStatusLoading(null);
        }
    }

    async function handlePriorityChange(id, priority) {
        try {
            setPriorityLoading(id);
            setError("");

            await updateComplaintPriority(id, priority);

            setComplaints((currentComplaints) =>
                currentComplaints.map((complaint) => {
                    const complaintId =
                        complaint.id || complaint.complaint_id;

                    if (complaintId === id) {
                        return {
                            ...complaint,
                            priority: priority,
                        };
                    }

                    return complaint;
                })
            );

            toast.success("Complaint priority updated successfully");
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setPriorityLoading(null);
        }
    }

    function openDeleteModal(id) {
        setDeleteId(id);
        setShowDeleteModal(true);
    }

    async function handleDelete() {
        if (!deleteId) {
            return;
        }

        try {
            setDeleteLoading(true);
            setError("");

            await deleteComplaint(deleteId);

            setComplaints((currentComplaints) =>
                currentComplaints.filter((complaint) => {
                    const complaintId =
                        complaint.id || complaint.complaint_id;

                    return complaintId !== deleteId;
                })
            );

            toast.success("Complaint deleted successfully");

            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setDeleteLoading(false);
        }
    }

    function clearFilters() {
        setSearch("");
        setStatusFilter("");
        setPriorityFilter("");
        setCategoryFilter("");
    }

    function formatDate(date) {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function formatStatus(status) {
        if (!status) {
            return "Pending";
        }

        return status
            .replace("_", " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function formatPriority(priority) {
        if (!priority) {
            return "Medium";
        }

        return (
            priority.charAt(0).toUpperCase() +
            priority.slice(1).toLowerCase()
        );
    }

    function getStatusClass(status) {
        const value = String(status || "").toLowerCase();

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

    function getPriorityClass(priority) {
        const value = String(
            priority || "medium"
        ).toLowerCase();

        if (value === "high") {
            return "border-red-300 bg-red-50 text-red-700";
        }

        if (value === "low") {
            return "border-green-300 bg-green-50 text-green-700";
        }

        return "border-yellow-300 bg-yellow-50 text-yellow-700";
    }

    const categories = [
        ...new Set(
            complaints
                .map((complaint) => complaint.category)
                .filter(Boolean)
        ),
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="page-enter space-y-5 sm:space-y-6 px-3 sm:px-0">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-base-content/60 mb-2">

                        <Link
                            to="/admin"
                            className="hover:text-primary transition"
                        >
                            Admin Dashboard
                        </Link>

                        <span>/</span>

                        <span>Manage Complaints</span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                        Manage Complaints
                    </h1>

                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Review and manage citizen complaints.
                    </p>

                </div>

                <button
                    onClick={() => loadComplaints(true)}
                    disabled={refreshing}
                    className="btn btn-primary gap-2 w-full sm:w-auto"
                >
                    <FiRefreshCw
                        className={refreshing ? "animate-spin" : ""}
                    />

                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="alert alert-error shadow-sm items-start sm:items-center">

                    <FiAlertCircle className="shrink-0" />

                    <span className="text-sm break-words flex-1">
                        {error}
                    </span>

                    <button
                        onClick={() => setError("")}
                        className="btn btn-ghost btn-sm shrink-0"
                    >
                        <FiX />
                    </button>

                </div>
            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                {/* Total */}

                <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                    <div className="card-body p-4 sm:p-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Total Complaints
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                                    {complaints.length}
                                </h2>
                            </div>

                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <FiFileText size={21} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* Pending */}

                <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                    <div className="card-body p-4 sm:p-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Pending
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                                    {
                                        complaints.filter(
                                            (complaint) =>
                                                complaint.status === "pending"
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                                <FiClock size={21} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* In Progress */}

                <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                    <div className="card-body p-4 sm:p-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    In Progress
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                                    {
                                        complaints.filter(
                                            (complaint) =>
                                                complaint.status === "in_progress"
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                <FiAlertCircle size={21} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* Resolved */}

                <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                    <div className="card-body p-4 sm:p-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Resolved
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                                    {
                                        complaints.filter(
                                            (complaint) =>
                                                complaint.status === "resolved"
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <FiCheckCircle size={21} />
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                FILTERS
            ========================= */}

            <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                <div className="card-body p-4 sm:p-5 md:p-6">

                    <div className="flex items-center gap-2 mb-4">

                        <FiFilter className="text-primary" />

                        <h2 className="font-semibold text-base sm:text-lg">
                            Search & Filters
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                        {/* Search */}

                        <label className="input input-bordered flex items-center gap-2 w-full sm:col-span-2 lg:col-span-1">

                            <FiSearch className="text-slate-400 shrink-0" />

                            <input
                                type="text"
                                placeholder="Search complaints..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="grow min-w-0 text-sm sm:text-base"
                            />

                        </label>


                        {/* Status */}

                        <select
                            className="select select-bordered w-full text-sm sm:text-base"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Status
                            </option>

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


                        {/* Priority */}

                        <select
                            className="select select-bordered w-full text-sm sm:text-base"
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Priority
                            </option>

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


                        {/* Category */}

                        <select
                            className="select select-bordered w-full text-sm sm:text-base"
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}

                        </select>


                        {/* Clear */}

                        <button
                            onClick={clearFilters}
                            className="btn btn-outline gap-2 w-full"
                        >
                            <FiX />
                            Clear Filters
                        </button>

                    </div>

                </div>

            </div>


            {/* =========================
                COMPLAINTS
            ========================= */}

            <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl">

                <div className="card-body p-0">

                    {/* Section Header */}

                    <div className="p-4 sm:p-5 border-b border-base-200">

                        <h2 className="text-base sm:text-lg font-bold text-slate-800">
                            Complaints
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Showing {filteredComplaints.length} of{" "}
                            {complaints.length} complaints
                        </p>

                    </div>


                    {/* =========================
                        EMPTY
                    ========================= */}

                    {filteredComplaints.length === 0 ? (

                        <div className="p-8 sm:p-12 text-center">

                            <FiFileText
                                size={40}
                                className="mx-auto text-slate-300 mb-4 sm:w-[45px] sm:h-[45px]"
                            />

                            <h3 className="text-base sm:text-lg font-semibold text-slate-700">
                                No complaints found
                            </h3>

                            <p className="text-sm sm:text-base text-slate-500 mt-1">
                                Try changing your search or filters.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* =========================
                                MOBILE + TABLET CARD VIEW
                            ========================= */}

                            <div className="lg:hidden p-3 sm:p-4 space-y-4">

                                {filteredComplaints.map((complaint) => {

                                    const id =
                                        complaint.id ||
                                        complaint.complaint_id;

                                    const priority =
                                        complaint.priority || "medium";

                                    const status =
                                        complaint.status || "pending";

                                    return (
                                        <div
                                            key={id}
                                            className="border border-base-200 rounded-2xl p-4 sm:p-5 bg-base-100 shadow-sm"
                                        >

                                            {/* Complaint Header */}

                                            <div className="flex items-start gap-3">

                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <FiFileText />
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base break-words">
                                                        {complaint.title ||
                                                            "Untitled Complaint"}
                                                    </h3>

                                                    <p className="text-xs text-slate-400 mt-1 break-all">
                                                        ID: #{id}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Description */}

                                            <p className="text-sm text-slate-500 mt-3 leading-6 break-words">
                                                {complaint.description ||
                                                    "No description"}
                                            </p>


                                            {/* Category + Location */}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-400 mb-1">
                                                        Category
                                                    </p>

                                                    <p className="text-sm font-medium text-slate-700 break-words">
                                                        {complaint.category ||
                                                            "Other"}
                                                    </p>

                                                </div>


                                                <div className="rounded-xl bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-400 mb-1">
                                                        Location
                                                    </p>

                                                    <div className="flex items-start gap-2 text-sm text-slate-600">

                                                        <FiMapPin className="text-primary shrink-0 mt-0.5" />

                                                        <span className="break-words">
                                                            {complaint.location ||
                                                                "N/A"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Date */}

                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-4">

                                                <FiCalendar className="shrink-0" />

                                                <span>
                                                    {formatDate(
                                                        complaint.created_at
                                                    )}
                                                </span>

                                            </div>


                                            {/* Priority */}

                                            <div className="mt-4">

                                                <div className="flex items-center gap-2 mb-2">

                                                    <FiFlag className="text-slate-400" />

                                                    <span className="text-xs font-semibold text-slate-500">
                                                        Priority
                                                    </span>

                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                                                    <span
                                                        className={`badge badge-sm font-semibold self-start ${priority === "high"
                                                                ? "badge-error"
                                                                : priority === "low"
                                                                    ? "badge-success"
                                                                    : "badge-warning"
                                                            }`}
                                                    >
                                                        {formatPriority(priority)}
                                                    </span>

                                                    <select
                                                        value={priority}
                                                        onChange={(e) =>
                                                            handlePriorityChange(
                                                                id,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            priorityLoading === id
                                                        }
                                                        className={`select select-bordered select-sm w-full sm:flex-1 ${getPriorityClass(
                                                            priority
                                                        )}`}
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

                                            </div>


                                            {/* Status */}

                                            <div className="mt-4">

                                                <div className="flex items-center gap-2 mb-2">

                                                    <FiClock className="text-slate-400" />

                                                    <span className="text-xs font-semibold text-slate-500">
                                                        Status
                                                    </span>

                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                                                    <span
                                                        className={`badge font-semibold self-start ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {formatStatus(status)}
                                                    </span>

                                                    <select
                                                        value={status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                id,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            statusLoading === id
                                                        }
                                                        className="select select-bordered select-sm w-full sm:flex-1"
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

                                            </div>


                                            {/* Actions */}

                                            <div className="grid grid-cols-2 gap-2 mt-5">

                                                <Link
                                                    to={`/complaints/${id}`}
                                                    className="btn btn-sm btn-outline btn-primary w-full"
                                                >
                                                    <FiEye />
                                                    View
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(id)
                                                    }
                                                    className="btn btn-sm btn-outline btn-error w-full"
                                                >
                                                    <FiTrash2 />
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>


                            {/* =========================
                                DESKTOP TABLE
                            ========================= */}

                            <div className="hidden lg:block overflow-x-auto">

                                <table className="table w-full">

                                    <thead>
                                        <tr>

                                            <th>
                                                Complaint
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Location
                                            </th>

                                            <th>
                                                Priority
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th className="text-right">
                                                Actions
                                            </th>

                                        </tr>
                                    </thead>


                                    <tbody>

                                        {filteredComplaints.map((complaint) => {

                                            const id =
                                                complaint.id ||
                                                complaint.complaint_id;

                                            const priority =
                                                complaint.priority || "medium";

                                            const status =
                                                complaint.status || "pending";

                                            return (
                                                <tr key={id}>

                                                    {/* Complaint */}

                                                    <td className="min-w-[260px]">

                                                        <div className="flex items-start gap-3">

                                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                                <FiFileText />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <h3 className="font-semibold text-slate-800 break-words">
                                                                    {complaint.title ||
                                                                        "Untitled Complaint"}
                                                                </h3>

                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    ID: #{id}
                                                                </p>

                                                                <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                                                                    {complaint.description ||
                                                                        "No description"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* Category */}

                                                    <td>

                                                        <span className="text-sm font-medium break-words">
                                                            {complaint.category ||
                                                                "Other"}
                                                        </span>

                                                    </td>


                                                    {/* Location */}

                                                    <td className="min-w-[180px]">

                                                        <div className="flex items-start gap-2 text-sm text-slate-600">

                                                            <FiMapPin className="text-primary shrink-0 mt-0.5" />

                                                            <span className="line-clamp-2">
                                                                {complaint.location ||
                                                                    "N/A"}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* Priority */}

                                                    <td className="min-w-[150px]">

                                                        <div className="flex flex-col gap-2">

                                                            <span
                                                                className={`badge badge-sm font-semibold self-start ${priority === "high"
                                                                        ? "badge-error"
                                                                        : priority === "low"
                                                                            ? "badge-success"
                                                                            : "badge-warning"
                                                                    }`}
                                                            >

                                                                <FiFlag className="mr-1" />

                                                                {formatPriority(
                                                                    priority
                                                                )}

                                                            </span>

                                                            <select
                                                                value={priority}
                                                                onChange={(e) =>
                                                                    handlePriorityChange(
                                                                        id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    priorityLoading ===
                                                                    id
                                                                }
                                                                className={`select select-bordered select-sm w-full ${getPriorityClass(
                                                                    priority
                                                                )}`}
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

                                                    </td>


                                                    {/* Status */}

                                                    <td className="min-w-[160px]">

                                                        <div className="flex flex-col gap-2">

                                                            <span
                                                                className={`badge font-semibold self-start ${getStatusClass(
                                                                    status
                                                                )}`}
                                                            >
                                                                {formatStatus(
                                                                    status
                                                                )}
                                                            </span>

                                                            <select
                                                                value={status}
                                                                onChange={(e) =>
                                                                    handleStatusChange(
                                                                        id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    statusLoading ===
                                                                    id
                                                                }
                                                                className="select select-bordered select-sm w-full"
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

                                                    </td>


                                                    {/* Date */}

                                                    <td>

                                                        <div className="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">

                                                            <FiCalendar />

                                                            {formatDate(
                                                                complaint.created_at
                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* Actions */}

                                                    <td>

                                                        <div className="flex justify-end gap-2">

                                                            <Link
                                                                to={`/complaints/${id}`}
                                                                className="btn btn-sm btn-outline btn-primary"
                                                                title="View complaint"
                                                            >
                                                                <FiEye />
                                                            </Link>

                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        id
                                                                    )
                                                                }
                                                                className="btn btn-sm btn-outline btn-error"
                                                                title="Delete complaint"
                                                            >
                                                                <FiTrash2 />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )}

                </div>

            </div>


            {/* =========================
                BACK BUTTON
            ========================= */}

            <div>

                <Link
                    to="/admin"
                    className="btn btn-ghost gap-2 w-full sm:w-auto"
                >
                    <FiArrowLeft />
                    Back to Dashboard
                </Link>

            </div>


            {/* =========================
                DELETE MODAL
            ========================= */}

            <ConfirmModal
                open={showDeleteModal}
                title="Delete Complaint"
                message="Are you sure you want to delete this complaint? This action cannot be undone."
                confirmText={
                    deleteLoading
                        ? "Deleting..."
                        : "Delete Complaint"
                }
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setShowDeleteModal(false);
                        setDeleteId(null);
                    }
                }}
                loading={deleteLoading}
            />

        </div>
    );
}

export default ManageComplaints;