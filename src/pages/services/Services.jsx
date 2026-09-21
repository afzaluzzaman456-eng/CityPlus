import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiActivity,
    FiArrowLeft,
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiFileText,
    FiFilter,
    FiMapPin,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiSliders,
    FiX,
} from "react-icons/fi";

import Loading from "../../components/Loading";
import { getServices } from "../../service/ServiceRequestService";

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState("desc");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        categoryFilter,
        startDate,
        endDate,
        sortBy,
        order,
        pageSize,
    ]);

    useEffect(() => {
        loadServices();
    }, [
        search,
        statusFilter,
        categoryFilter,
        startDate,
        endDate,
        sortBy,
        order,
        currentPage,
        pageSize,
    ]);

    async function loadServices() {
        try {
            setLoading(true);
            setError("");

            const data = await getServices({
                search: search.trim(),
                category:
                    categoryFilter === "all"
                        ? ""
                        : categoryFilter,
                status:
                    statusFilter === "all"
                        ? ""
                        : statusFilter,
                startDate,
                endDate,
                sortBy,
                order,
                page: currentPage,
                pageSize,
            });

            let result = [];
            let total = null;

            if (Array.isArray(data)) {
                result = data;
            } else if (data && Array.isArray(data.items)) {
                result = data.items;
                total = data.total;
            } else if (data && Array.isArray(data.data)) {
                result = data.data;
                total = data.total;
            } else if (
                data &&
                Array.isArray(data.services)
            ) {
                result = data.services;
                total = data.total;
            }

            setServices(result);

            if (typeof total === "number") {
                setHasNextPage(
                    currentPage * pageSize < total
                );
            } else {
                setHasNextPage(
                    result.length === pageSize
                );
            }
        } catch (error) {
            setError(error.message);
            setServices([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    }

    function getStatus(service) {
        return service.status || "pending";
    }

    function getStatusClass(status) {
        const value = status.toLowerCase();

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

    function formatStatus(status) {
        if (!status) {
            return "Pending";
        }

        if (status.toLowerCase() === "in_progress") {
            return "In Progress";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    }

    function formatDate(date) {
        if (!date) {
            return "Date not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString();
    }

    const categories = useMemo(() => {
        const defaultCategories = [
            "Roads & Potholes",
            "Garbage & Waste",
            "Street Lights",
            "Water & Drainage",
            "Public Safety",
            "Other",
        ];

        const currentCategories = services.map(
            (service) =>
                service.category || "General Service"
        );

        return [
            ...new Set([
                ...defaultCategories,
                ...currentCategories,
            ]),
        ];
    }, [services]);

    function clearFilters() {
        setSearch("");
        setStatusFilter("all");
        setCategoryFilter("all");
        setStartDate("");
        setEndDate("");
        setSortBy("created_at");
        setOrder("desc");
        setCurrentPage(1);
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }

    function handleNextPage() {
        if (hasNextPage) {
            setCurrentPage((page) => page + 1);
        }
    }

    const hasActiveFilters =
        search ||
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        startDate ||
        endDate ||
        sortBy !== "created_at" ||
        order !== "desc";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-7xl mx-auto page-enter">

                {/* ================= HEADER ================= */}

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-city-lg mb-5 sm:mb-7">

                    <div className="absolute -top-20 sm:-top-24 -right-20 sm:-right-24 w-56 h-56 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="absolute -bottom-24 sm:-bottom-32 -left-16 sm:-left-20 w-64 h-64 sm:w-80 sm:h-80 bg-cyan-300/20 rounded-full blur-3xl"></div>

                    <div className="relative px-4 sm:px-6 md:px-8 lg:px-10 py-7 sm:py-8 md:py-10">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">

                            <div className="min-w-0">

                                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm mb-3 sm:mb-4">
                                    <FiActivity size={15} />
                                    City Services
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                                    Service Requests
                                </h1>

                                <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl leading-6">
                                    Request and track essential city services easily from one place.
                                </p>

                            </div>

                            <Link
                                to="/services/create"
                                className="btn bg-white text-blue-600 border-none hover:bg-white/90 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300 w-full lg:w-auto min-h-11 sm:min-h-12"
                            >
                                <FiPlus size={18} />
                                Create Service Request
                            </Link>

                        </div>

                    </div>
                </div>


                {/* ================= SEARCH & FILTERS ================= */}

                {!loading && !error && (
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg mb-5 sm:mb-7">

                        <div className="absolute -top-20 sm:-top-24 -right-20 sm:-right-24 w-44 h-44 sm:w-56 sm:h-56 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative p-4 sm:p-6 md:p-7">

                            {/* Filter Header */}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">

                                <div className="flex items-center gap-3 min-w-0">

                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <FiFilter size={19} />
                                    </div>

                                    <div className="min-w-0">

                                        <h2 className="font-bold text-base sm:text-lg text-slate-900">
                                            Search & Filters
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Find service requests quickly
                                        </p>

                                    </div>

                                </div>

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="btn btn-sm btn-ghost text-slate-500 hover:text-error rounded-xl w-full sm:w-auto"
                                    >
                                        <FiX size={15} />
                                        Clear Filters
                                    </button>
                                )}

                            </div>


                            {/* Filter Grid */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                                {/* Search */}

                                <div className="sm:col-span-2">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Search
                                    </label>

                                    <div className="relative">

                                        <FiSearch
                                            size={18}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Search by title, description, location or ID..."
                                            className="input input-bordered w-full pl-10 sm:pl-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />

                                    </div>

                                </div>


                                {/* Status */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Status
                                    </label>

                                    <div className="relative">

                                        <FiActivity
                                            size={17}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none z-10"
                                        />

                                        <select
                                            className="select select-bordered w-full pl-9 sm:pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base"
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                        >
                                            <option value="all">
                                                All Statuses
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

                                    </div>

                                </div>


                                {/* Category */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Category
                                    </label>

                                    <div className="relative">

                                        <FiFileText
                                            size={17}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-violet-500 pointer-events-none z-10"
                                        />

                                        <select
                                            className="select select-bordered w-full pl-9 sm:pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 text-sm sm:text-base"
                                            value={categoryFilter}
                                            onChange={(e) =>
                                                setCategoryFilter(e.target.value)
                                            }
                                        >
                                            <option value="all">
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

                                    </div>

                                </div>


                                {/* Start Date */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Start Date
                                    </label>

                                    <div className="relative">

                                        <FiCalendar
                                            size={17}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
                                        />

                                        <input
                                            type="date"
                                            className="input input-bordered w-full pl-9 sm:pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                        />

                                    </div>

                                </div>


                                {/* End Date */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        End Date
                                    </label>

                                    <div className="relative">

                                        <FiCalendar
                                            size={17}
                                            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
                                        />

                                        <input
                                            type="date"
                                            className="input input-bordered w-full pl-9 sm:pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm sm:text-base min-h-11 sm:min-h-12"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                        />

                                    </div>

                                </div>


                                {/* Sort */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Sort By
                                    </label>

                                    <select
                                        className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                    >
                                        <option value="created_at">
                                            Created Date
                                        </option>

                                        <option value="title">
                                            Title
                                        </option>

                                        <option value="status">
                                            Status
                                        </option>
                                    </select>

                                </div>


                                {/* Order */}

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Order
                                    </label>

                                    <select
                                        className="select select-bordered w-full rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base"
                                        value={order}
                                        onChange={(e) =>
                                            setOrder(e.target.value)
                                        }
                                    >
                                        <option value="desc">
                                            Descending
                                        </option>

                                        <option value="asc">
                                            Ascending
                                        </option>
                                    </select>

                                </div>

                            </div>


                            {/* Bottom Controls */}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100">

                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

                                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                        <FiSliders size={17} />
                                    </div>

                                    <label className="text-sm font-semibold text-slate-600">
                                        Items per page
                                    </label>

                                    <select
                                        className="select select-bordered select-sm rounded-lg"
                                        value={pageSize}
                                        onChange={(e) =>
                                            setPageSize(
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value={6}>6</option>
                                        <option value={12}>12</option>
                                        <option value={24}>24</option>
                                        <option value={50}>50</option>
                                    </select>

                                </div>

                                <div className="text-xs text-slate-400 sm:text-right">
                                    {hasActiveFilters
                                        ? "Filters are currently active"
                                        : "Showing latest service requests"}
                                </div>

                            </div>

                        </div>
                    </div>
                )}


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-red-100 shadow-city-lg">

                        <div className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-44 h-44 sm:w-56 sm:h-56 bg-red-100/50 rounded-full blur-3xl"></div>

                        <div className="relative text-center py-12 sm:py-16 px-4 sm:px-6">

                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-4 sm:mb-5 float-animation">
                                <FiRefreshCw size={28} className="sm:w-8 sm:h-8" />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Failed to Load Service Requests
                            </h2>

                            <p className="text-red-500 mt-2 text-sm sm:text-base break-words">
                                {error}
                            </p>

                            <button
                                onClick={loadServices}
                                className="btn btn-primary rounded-xl mt-5 sm:mt-6"
                            >
                                <FiRefreshCw size={17} />
                                Try Again
                            </button>

                        </div>

                    </div>
                )}


                {/* ================= LOADING ================= */}

                {loading && <Loading />}


                {/* ================= EMPTY ================= */}

                {!loading &&
                    !error &&
                    services.length === 0 && (
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-city-lg">

                            <div className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-52 h-52 sm:w-64 sm:h-64 bg-blue-100/50 rounded-full blur-3xl"></div>

                            <div className="absolute -bottom-16 sm:-bottom-20 -left-16 sm:-left-20 w-52 h-52 sm:w-64 sm:h-64 bg-cyan-100/40 rounded-full blur-3xl"></div>

                            <div className="relative text-center py-12 sm:py-16 px-4 sm:px-6">

                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 sm:mb-5 float-animation">
                                    <FiFileText size={30} className="sm:w-[34px] sm:h-[34px]" />
                                </div>

                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    No Service Requests
                                </h2>

                                <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md mx-auto leading-6">
                                    There are no service requests matching your current filters.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5 sm:mt-6">

                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="btn btn-outline rounded-xl w-full sm:w-auto"
                                        >
                                            <FiX size={17} />
                                            Clear Filters
                                        </button>
                                    )}

                                    <Link
                                        to="/services/create"
                                        className="btn btn-primary rounded-xl w-full sm:w-auto"
                                    >
                                        <FiPlus size={17} />
                                        Create Request
                                    </Link>

                                </div>

                            </div>

                        </div>
                    )}


                {/* ================= SERVICE LIST ================= */}

                {!loading &&
                    !error &&
                    services.length > 0 && (
                        <>

                            {/* Section Heading */}

                            <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">

                                <div className="min-w-0">

                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                        Available Services
                                    </h2>

                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Browse and track city service requests
                                    </p>

                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 shrink-0">
                                    <FiCheckCircle className="text-emerald-500" />
                                    Page {currentPage}
                                </div>

                            </div>


                            {/* Cards */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

                                {services.map((service, index) => {

                                    const status = getStatus(service);

                                    return (
                                        <div
                                            key={service.id || index}
                                            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-city-lg hover:-translate-y-2 transition-all duration-300"
                                        >

                                            {/* Top Accent */}

                                            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                                            <div className="p-4 sm:p-5 md:p-6">

                                                {/* Card Top */}

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                                                        <FiActivity size={20} />
                                                    </div>

                                                    <span
                                                        className={`badge ${getStatusClass(
                                                            status
                                                        )} px-2.5 sm:px-3 py-3 text-xs sm:text-sm max-w-[120px] text-center`}
                                                    >
                                                        {formatStatus(status)}
                                                    </span>

                                                </div>


                                                {/* Title */}

                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 sm:mt-5 line-clamp-2 group-hover:text-blue-600 transition-colors break-words">
                                                    {service.title ||
                                                        "Untitled Request"}
                                                </h2>


                                                {/* Category */}

                                                <div className="inline-flex max-w-full items-center gap-2 mt-3 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">

                                                    <FiFileText
                                                        size={13}
                                                        className="shrink-0"
                                                    />

                                                    <span className="truncate">
                                                        {service.category ||
                                                            "General Service"}
                                                    </span>

                                                </div>


                                                {/* Description */}

                                                <p className="text-sm text-slate-500 mt-4 leading-6 line-clamp-3 break-words">
                                                    {service.description ||
                                                        "No description available."}
                                                </p>


                                                {/* Info */}

                                                <div className="mt-5 space-y-3">

                                                    {/* Location */}

                                                    <div className="flex items-start gap-3 text-sm text-slate-500">

                                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                            <FiMapPin size={15} />
                                                        </div>

                                                        <span className="pt-1 line-clamp-2 break-words min-w-0">
                                                            {service.location ||
                                                                "Location not available"}
                                                        </span>

                                                    </div>


                                                    {/* Date */}

                                                    <div className="flex items-center gap-3 text-sm text-slate-500">

                                                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                                                            <FiCalendar size={15} />
                                                        </div>

                                                        <span>
                                                            {formatDate(
                                                                service.created_at
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* View Button */}

                                                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100">

                                                    <Link
                                                        to={`/services/${service.id}`}
                                                        className="btn btn-outline btn-sm w-full rounded-xl group-hover:btn-primary transition-all"
                                                    >
                                                        View Details
                                                        <FiArrowRight size={16} />
                                                    </Link>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        </>
                    )}


                {/* ================= PAGINATION ================= */}

                {!loading &&
                    !error &&
                    services.length > 0 && (
                        <div className="mt-6 sm:mt-8 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 sm:p-4">

                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">

                                <button
                                    className="btn btn-outline rounded-xl w-full sm:w-auto"
                                    disabled={currentPage === 1}
                                    onClick={handlePreviousPage}
                                >
                                    <FiArrowLeft size={17} />
                                    Previous
                                </button>


                                <div className="flex items-center justify-center gap-3">

                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <FiFileText size={17} />
                                    </div>

                                    <div className="text-center">

                                        <p className="text-xs text-slate-400">
                                            Current Page
                                        </p>

                                        <p className="font-bold text-slate-800">
                                            {currentPage}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="btn btn-primary rounded-xl w-full sm:w-auto"
                                    disabled={!hasNextPage}
                                    onClick={handleNextPage}
                                >
                                    Next
                                    <FiArrowRight size={17} />
                                </button>

                            </div>

                        </div>
                    )}

            </div>
        </div>
    );
}

export default Services;