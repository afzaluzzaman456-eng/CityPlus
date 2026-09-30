import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    getComplaints,
    getMyComplaints,
    updateComplaintStatus,
    updateComplaintPriority,
} from "../../service/ComplaintService";


const Complaints = () => {

    const location = useLocation();


    // =====================================================
    // USER
    // =====================================================

    const user = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch {
            return null;
        }
    }, []);


    const isAdmin =
        String(user?.role || "")
            .trim()
            .toLowerCase() === "admin";


    const isMyComplaints =
        location.pathname === "/complaints/my";


    // =====================================================
    // STATES
    // =====================================================

    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [sortBy, setSortBy] =
        useState("created_at");

    const [order, setOrder] =
        useState("desc");

    const [currentPage, setCurrentPage] =
        useState(1);

    const pageSize = 5;

    const [total, setTotal] = useState(0);

    const [hasNextPage, setHasNextPage] =
        useState(false);

    const [updatingId, setUpdatingId] =
        useState(null);


    // =====================================================
    // HELPERS
    // =====================================================

    const getComplaintId = (complaint) => {
        return (
            complaint?.id ??
            complaint?.complaint_id ??
            complaint?.complaintId
        );
    };


    const getTitle = (complaint) => {
        return (
            complaint?.title ||
            "Untitled Complaint"
        );
    };


    const getDescription = (complaint) => {
        return (
            complaint?.description ||
            ""
        );
    };


    const getCategory = (complaint) => {
        return (
            complaint?.category ||
            "N/A"
        );
    };


    const getLocation = (complaint) => {
        return (
            complaint?.location ||
            "N/A"
        );
    };


    const getStatus = (complaint) => {
        return (
            complaint?.status ||
            "pending"
        );
    };


    const getPriority = (complaint) => {
        return (
            complaint?.priority ||
            "medium"
        );
    };


    const getDate = (complaint) => {
        return (
            complaint?.created_at ||
            complaint?.createdAt ||
            complaint?.date ||
            ""
        );
    };


    const getUserName = (complaint) => {

        if (complaint?.user?.username) {
            return complaint.user.username;
        }

        if (complaint?.username) {
            return complaint.username;
        }

        if (complaint?.user_name) {
            return complaint.user_name;
        }

        return "Unknown";
    };


    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "N/A";
        }

        const date = new Date(dateValue);

        if (
            Number.isNaN(date.getTime())
        ) {
            return String(dateValue);
        }

        return date.toLocaleString();
    };


    // =====================================================
    // EXTRACT RESPONSE
    // =====================================================

    const extractComplaints = (data) => {

        if (Array.isArray(data)) {
            return {
                items: data,
                total: data.length,
            };
        }


        if (Array.isArray(data?.items)) {
            return {
                items: data.items,
                total:
                    typeof data.total === "number"
                        ? data.total
                        : data.items.length,
            };
        }


        if (
            Array.isArray(
                data?.complaints
            )
        ) {
            return {
                items: data.complaints,
                total:
                    typeof data.total === "number"
                        ? data.total
                        : data.complaints.length,
            };
        }


        if (Array.isArray(data?.data)) {
            return {
                items: data.data,
                total:
                    typeof data.total === "number"
                        ? data.total
                        : data.data.length,
            };
        }


        return {
            items: [],
            total: 0,
        };
    };


    // =====================================================
    // LOAD COMPLAINTS
    // =====================================================

    const loadComplaints = async () => {

        try {

            setLoading(true);
            setError("");


            // =================================================
            // NORMAL USER
            // =================================================

            if (!isAdmin) {

                const data =
                    await getMyComplaints({
                        search: search.trim(),

                        category:
                            categoryFilter === "all"
                                ? ""
                                : categoryFilter,

                        status:
                            statusFilter === "all"
                                ? ""
                                : statusFilter,

                        priority:
                            priorityFilter === "all"
                                ? ""
                                : priorityFilter,

                        startDate,
                        endDate,
                        sortBy,
                        order,
                    });


                const extracted =
                    extractComplaints(data);


                setComplaints(
                    extracted.items
                );

                setTotal(
                    extracted.total
                );

                setHasNextPage(false);

                return;
            }


            // =================================================
            // ADMIN
            // =================================================

            const data =
                await getComplaints({
                    search: search.trim(),

                    category:
                        categoryFilter === "all"
                            ? ""
                            : categoryFilter,

                    status:
                        statusFilter === "all"
                            ? ""
                            : statusFilter,

                    priority:
                        priorityFilter === "all"
                            ? ""
                            : priorityFilter,

                    startDate,
                    endDate,
                    sortBy,
                    order,

                    page: currentPage,

                    pageSize,
                });


            const extracted =
                extractComplaints(data);


            setComplaints(
                extracted.items
            );

            setTotal(
                extracted.total
            );


            setHasNextPage(
                currentPage * pageSize <
                extracted.total
            );

        } catch (err) {

            console.error(
                "LOAD COMPLAINTS ERROR:",
                err
            );

            setError(
                err?.message ||
                "Failed to load complaints"
            );

            setComplaints([]);

            setTotal(0);

            setHasNextPage(false);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        loadComplaints();

    }, [
        isAdmin,
        isMyComplaints,
        currentPage,
        categoryFilter,
        statusFilter,
        priorityFilter,
        sortBy,
        order,
        startDate,
        endDate,
    ]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (e) => {

        e.preventDefault();

        setCurrentPage(1);

        loadComplaints();
    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");

        setCategoryFilter("all");

        setStatusFilter("all");

        setPriorityFilter("all");

        setStartDate("");

        setEndDate("");

        setSortBy("created_at");

        setOrder("desc");

        setCurrentPage(1);
    };


    // =====================================================
    // STATUS UPDATE
    // =====================================================

    const handleStatusChange = async (
        complaintId,
        status
    ) => {

        if (!isAdmin) {

            toast.error(
                "Only admin can update complaint status"
            );

            return;
        }


        try {

            setUpdatingId(
                complaintId
            );


            await updateComplaintStatus(
                complaintId,
                status
            );


            toast.success(
                "Complaint status updated successfully"
            );


            await loadComplaints();

        } catch (err) {

            console.error(
                "STATUS UPDATE ERROR:",
                err
            );

            toast.error(
                err?.message ||
                "Failed to update status"
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // PRIORITY UPDATE
    // =====================================================

    const handlePriorityChange = async (
        complaintId,
        priority
    ) => {

        if (!isAdmin) {

            toast.error(
                "Only admin can update complaint priority"
            );

            return;
        }


        try {

            setUpdatingId(
                complaintId
            );


            await updateComplaintPriority(
                complaintId,
                priority
            );


            toast.success(
                "Complaint priority updated successfully"
            );


            await loadComplaints();

        } catch (err) {

            console.error(
                "PRIORITY UPDATE ERROR:",
                err
            );

            toast.error(
                err?.message ||
                "Failed to update priority"
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        const value =
            String(status)
                .toLowerCase()
                .replace(/ /g, "_");


        if (value === "resolved") {
            return "bg-green-100 text-green-700";
        }


        if (value === "in_progress") {
            return "bg-blue-100 text-blue-700";
        }


        if (value === "rejected") {
            return "bg-red-100 text-red-700";
        }


        return "bg-yellow-100 text-yellow-700";
    };


    // =====================================================
    // PRIORITY CLASS
    // =====================================================

    const getPriorityClass = (priority) => {

        const value =
            String(priority)
                .toLowerCase();


        if (
            value === "high" ||
            value === "urgent" ||
            value === "critical"
        ) {
            return "bg-red-100 text-red-700";
        }


        if (value === "medium") {
            return "bg-orange-100 text-orange-700";
        }


        return "bg-green-100 text-green-700";
    };


    // =====================================================
    // DISPLAY STATUS
    // =====================================================

    const displayStatus = (status) => {

        if (status === "in_progress") {
            return "In Progress";
        }

        return (
            String(status)
                .replace(/_/g, " ")
                .replace(
                    /\b\w/g,
                    (char) =>
                        char.toUpperCase()
                )
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50 px-3 sm:px-5 md:px-6 py-5 sm:py-6">

                <div className="max-w-7xl mx-auto">

                    <div className="mb-5 sm:mb-6">

                        <div className="h-8 w-52 bg-gray-200 rounded animate-pulse"></div>

                        <div className="h-4 w-80 bg-gray-200 rounded mt-3 animate-pulse"></div>

                    </div>


                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">

                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>


                        <div className="space-y-4 mt-6">

                            {[1, 2, 3, 4, 5].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="h-20 bg-gray-100 rounded animate-pulse"
                                    />

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50 px-3 sm:px-5 md:px-6 py-5 sm:py-6 md:py-8">

            <div className="max-w-7xl mx-auto">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">

                            {isAdmin
                                ? "Complaints"
                                : "My Complaints"}

                        </h1>


                        <p className="text-sm sm:text-base text-gray-500 mt-1">

                            {isAdmin
                                ? "View and manage citizen complaints."
                                : "View and manage your submitted complaints."}

                        </p>

                    </div>


                    {/* =================================================
                        CREATE COMPLAINT
                    ================================================= */}

                    {!isAdmin && (

                        <Link
                            to="/complaints/create"
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >

                            <span className="text-xl leading-none">
                                +
                            </span>

                            Create Complaint

                        </Link>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

                            <div>

                                <h3 className="font-semibold text-red-700">
                                    Failed to Load Complaints
                                </h3>

                                <p className="text-sm text-red-600 mt-1">
                                    {error}
                                </p>

                            </div>


                            <button
                                onClick={
                                    loadComplaints
                                }
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Retry
                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-5 sm:mb-6">

                    <form
                        onSubmit={
                            handleSearch
                        }
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">


                            {/* SEARCH */}

                            <div className="sm:col-span-2 lg:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search complaints..."
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* CATEGORY */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>

                                <select
                                    value={
                                        categoryFilter
                                    }
                                    onChange={(e) => {

                                        setCategoryFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="all">
                                        All Categories
                                    </option>

                                    <option value="Road">
                                        Road
                                    </option>

                                    <option value="Garbage">
                                        Garbage
                                    </option>

                                    <option value="Water">
                                        Water
                                    </option>

                                    <option value="Electricity">
                                        Electricity
                                    </option>

                                    <option value="Drainage">
                                        Drainage
                                    </option>

                                    <option value="Street Light">
                                        Street Light
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* STATUS */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(e) => {

                                        setStatusFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="all">
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

                            </div>


                            {/* PRIORITY */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>

                                <select
                                    value={
                                        priorityFilter
                                    }
                                    onChange={(e) => {

                                        setPriorityFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="all">
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

                            </div>


                            {/* START DATE */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        startDate
                                    }
                                    onChange={(e) => {

                                        setStartDate(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* END DATE */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        endDate
                                    }
                                    onChange={(e) => {

                                        setEndDate(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* SORT BY */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort By
                                </label>

                                <select
                                    value={
                                        sortBy
                                    }
                                    onChange={(e) => {

                                        setSortBy(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                                    <option value="priority">
                                        Priority
                                    </option>

                                </select>

                            </div>


                            {/* ORDER */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order
                                </label>

                                <select
                                    value={
                                        order
                                    }
                                    onChange={(e) => {

                                        setOrder(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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


                        {/* BUTTONS */}

                        <div className="flex flex-col sm:flex-row gap-3 mt-5">

                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    COUNT
                ================================================= */}

                <div className="mb-3 sm:mb-4">

                    <p className="text-sm text-gray-500">

                        Showing{" "}

                        <span className="font-semibold text-gray-700">
                            {complaints.length}
                        </span>

                        {" "}of{" "}

                        <span className="font-semibold text-gray-700">
                            {total}
                        </span>

                        {" "}complaint
                        {total !== 1
                            ? "s"
                            : ""}

                    </p>

                </div>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {complaints.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">

                        <div className="text-5xl mb-4">
                            📋
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                            No complaints found
                        </h3>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            Try changing your search or filters.
                        </p>


                        {!isAdmin && (

                            <Link
                                to="/complaints/create"
                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >

                                <span className="text-lg">
                                    +
                                </span>

                                Create Complaint

                            </Link>

                        )}

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            MOBILE / TABLET
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:hidden">

                            {complaints.map(
                                (
                                    complaint,
                                    index
                                ) => {

                                    const id =
                                        getComplaintId(
                                            complaint
                                        );

                                    const status =
                                        getStatus(
                                            complaint
                                        );

                                    const priority =
                                        getPriority(
                                            complaint
                                        );

                                    const isUpdating =
                                        updatingId === id;


                                    return (

                                        <div
                                            key={
                                                id ??
                                                index
                                            }
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 break-words">
                                                        {
                                                            getTitle(
                                                                complaint
                                                            )
                                                        }
                                                    </h3>


                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-3">
                                                        {
                                                            getDescription(
                                                                complaint
                                                            )
                                                        }
                                                    </p>


                                                    {isAdmin && (

                                                        <p className="text-xs text-gray-400 mt-2">
                                                            User:{" "}
                                                            {
                                                                getUserName(
                                                                    complaint
                                                                )
                                                            }
                                                        </p>

                                                    )}

                                                </div>


                                                <span className="shrink-0 text-xs text-gray-400">
                                                    #{id ?? "N/A"}
                                                </span>

                                            </div>


                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">


                                                {/* CATEGORY */}

                                                <div>

                                                    <p className="text-xs text-gray-400 mb-1">
                                                        Category
                                                    </p>

                                                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm">
                                                        {
                                                            getCategory(
                                                                complaint
                                                            )
                                                        }
                                                    </span>

                                                </div>


                                                {/* LOCATION */}

                                                <div>

                                                    <p className="text-xs text-gray-400 mb-1">
                                                        Location
                                                    </p>

                                                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                                                        {
                                                            getLocation(
                                                                complaint
                                                            )
                                                        }
                                                    </p>

                                                </div>


                                                {/* PRIORITY */}

                                                <div>

                                                    <p className="text-xs text-gray-400 mb-1">
                                                        Priority
                                                    </p>


                                                    {isAdmin ? (

                                                        <select
                                                            value={
                                                                priority
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handlePriorityChange(
                                                                    id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getPriorityClass(
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

                                                    ) : (

                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityClass(
                                                                priority
                                                            )}`}
                                                        >
                                                            {
                                                                priority
                                                            }
                                                        </span>

                                                    )}

                                                </div>


                                                {/* STATUS */}

                                                <div>

                                                    <p className="text-xs text-gray-400 mb-1">
                                                        Status
                                                    </p>


                                                    {isAdmin ? (

                                                        <select
                                                            value={
                                                                status
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleStatusChange(
                                                                    id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusClass(
                                                                status
                                                            )}`}
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

                                                    ) : (

                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                                status
                                                            )}`}
                                                        >
                                                            {
                                                                displayStatus(
                                                                    status
                                                                )
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* DATE */}

                                            <div className="mt-4 pt-3 border-t border-gray-100">

                                                <p className="text-xs text-gray-400 mb-1">
                                                    Date
                                                </p>

                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {
                                                        formatDate(
                                                            getDate(
                                                                complaint
                                                            )
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                        </div>


                        {/* =================================================
                            DESKTOP TABLE
                        ================================================= */}

                        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b">

                                        <tr>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Complaint
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Category
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Location
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Priority
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {complaints.map(
                                            (
                                                complaint,
                                                index
                                            ) => {

                                                const id =
                                                    getComplaintId(
                                                        complaint
                                                    );

                                                const status =
                                                    getStatus(
                                                        complaint
                                                    );

                                                const priority =
                                                    getPriority(
                                                        complaint
                                                    );

                                                const isUpdating =
                                                    updatingId === id;


                                                return (

                                                    <tr
                                                        key={
                                                            id ??
                                                            index
                                                        }
                                                        className="hover:bg-gray-50 transition"
                                                    >


                                                        {/* COMPLAINT */}

                                                        <td className="px-5 py-4">

                                                            <div className="max-w-sm">

                                                                <p className="font-semibold text-gray-800 break-words">
                                                                    {
                                                                        getTitle(
                                                                            complaint
                                                                        )
                                                                    }
                                                                </p>


                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                    {
                                                                        getDescription(
                                                                            complaint
                                                                        )
                                                                    }
                                                                </p>


                                                                {isAdmin && (

                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        User:{" "}
                                                                        {
                                                                            getUserName(
                                                                                complaint
                                                                            )
                                                                        }
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </td>


                                                        {/* CATEGORY */}

                                                        <td className="px-5 py-4">

                                                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                                                                {
                                                                    getCategory(
                                                                        complaint
                                                                    )
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* LOCATION */}

                                                        <td className="px-5 py-4">

                                                            <span className="text-sm text-gray-600">
                                                                {
                                                                    getLocation(
                                                                        complaint
                                                                    )
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* PRIORITY */}

                                                        <td className="px-5 py-4">

                                                            {isAdmin ? (

                                                                <select
                                                                    value={
                                                                        priority
                                                                    }
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handlePriorityChange(
                                                                            id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className={`max-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getPriorityClass(
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

                                                            ) : (

                                                                <span
                                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityClass(
                                                                        priority
                                                                    )}`}
                                                                >
                                                                    {
                                                                        priority
                                                                    }
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="px-5 py-4">

                                                            {isAdmin ? (

                                                                <select
                                                                    value={
                                                                        status
                                                                    }
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleStatusChange(
                                                                            id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className={`max-w-[140px] px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusClass(
                                                                        status
                                                                    )}`}
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

                                                            ) : (

                                                                <span
                                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                                        status
                                                                    )}`}
                                                                >
                                                                    {
                                                                        displayStatus(
                                                                            status
                                                                        )
                                                                    }
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="px-5 py-4">

                                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                                {
                                                                    formatDate(
                                                                        getDate(
                                                                            complaint
                                                                        )
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </>

                )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {isAdmin &&
                    total > 0 && (

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 sm:mt-6">

                            <button
                                type="button"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() => {

                                    setCurrentPage(
                                        (prev) =>
                                            Math.max(
                                                1,
                                                prev - 1
                                            )
                                    );

                                }}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg border text-sm transition ${
                                    currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                ← Previous
                            </button>


                            <span className="text-sm text-gray-600 order-first sm:order-none">

                                Page{" "}

                                <span className="font-semibold">
                                    {currentPage}
                                </span>

                                {" "}of{" "}

                                <span className="font-semibold">
                                    {Math.max(
                                        1,
                                        Math.ceil(
                                            total /
                                            pageSize
                                        )
                                    )}
                                </span>

                            </span>


                            <button
                                type="button"
                                disabled={
                                    !hasNextPage
                                }
                                onClick={() => {

                                    setCurrentPage(
                                        (prev) =>
                                            prev + 1
                                    );

                                }}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg border text-sm transition ${
                                    !hasNextPage
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Next →
                            </button>

                        </div>

                    )}

            </div>

        </div>
    );
};


export default Complaints;