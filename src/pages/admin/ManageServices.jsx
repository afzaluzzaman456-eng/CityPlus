import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiTrash2,
  FiFilter,
  FiTool,
  FiCalendar,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";

import {
  getAllServices,
  updateServiceStatus,
  deleteServiceRequest,
} from "../../service/ServiceRequestService";

function ManageServices() {
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAllServices();

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleStatusChange(serviceId, status) {
    try {
      setUpdatingId(serviceId);
      setError("");

      await updateServiceStatus(serviceId, status);

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                status: status,
              }
            : service
        )
      );

      toast.success("Service status updated");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function openDeleteModal(serviceId) {
    setSelectedServiceId(serviceId);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deletingId !== null) {
      return;
    }

    setSelectedServiceId(null);
    setShowDeleteModal(false);
  }

  async function handleDelete() {
    if (!selectedServiceId) {
      return;
    }

    const serviceId = selectedServiceId;

    try {
      setDeletingId(serviceId);
      setError("");

      await deleteServiceRequest(serviceId);

      setServices((currentServices) =>
        currentServices.filter(
          (service) => service.id !== serviceId
        )
      );

      toast.success("Service request deleted successfully");

      setSelectedServiceId(null);
      setShowDeleteModal(false);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  function getStatusClass(status) {
    const value = String(status || "pending").toLowerCase();

    if (
      value === "resolved" ||
      value === "completed"
    ) {
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

  function getStatusIcon(status) {
    const value = String(status || "pending").toLowerCase();

    if (
      value === "resolved" ||
      value === "completed"
    ) {
      return <FiCheckCircle size={14} />;
    }

    if (value === "in_progress") {
      return <FiClock size={14} />;
    }

    if (value === "rejected") {
      return <FiAlertCircle size={14} />;
    }

    return <FiClock size={14} />;
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

  function formatDate(date) {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  }

  const categories = useMemo(() => {
    return [
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((service) => {
        const id = String(service.id || "");
        const title = String(service.title || "");
        const description = String(service.description || "");
        const location = String(service.location || "");
        const category = String(service.category || "");

        return (
          id.includes(searchValue) ||
          title.toLowerCase().includes(searchValue) ||
          description.toLowerCase().includes(searchValue) ||
          location.toLowerCase().includes(searchValue) ||
          category.toLowerCase().includes(searchValue)
        );
      });
    }

    if (statusFilter) {
      result = result.filter(
        (service) =>
          String(service.status || "pending").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (categoryFilter) {
      result = result.filter(
        (service) =>
          String(service.category || "").toLowerCase() ===
          categoryFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return String(a.title || "").localeCompare(
          String(b.title || "")
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
        );
      }

      return (
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
      );
    });

    return result;
  }, [
    services,
    search,
    statusFilter,
    categoryFilter,
    sortBy,
  ]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setSortBy("newest");
  }

  const hasActiveFilters =
    search ||
    statusFilter ||
    categoryFilter ||
    sortBy !== "newest";

  const totalServices = services.length;

  const pendingServices = services.filter(
    (service) =>
      (service.status || "pending") === "pending"
  ).length;

  const progressServices = services.filter(
    (service) =>
      service.status === "in_progress"
  ).length;

  const resolvedServices = services.filter(
    (service) =>
      service.status === "resolved"
  ).length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-700 via-blue-600 to-blue-700 p-5 sm:p-7 md:p-8 lg:p-10 mb-6 sm:mb-8 shadow-city-lg text-white">

          <div className="absolute -top-16 sm:-top-24 -right-16 sm:-right-24 w-44 h-44 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="absolute -bottom-20 sm:-bottom-28 -left-12 sm:-left-20 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-300/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-7">

            <div className="min-w-0">

              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-white transition mb-4"
              >
                <FiArrowLeft size={15} />
                Back to Dashboard
              </Link>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                  <FiTool size={20} />
                </div>

                <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/80">
                  ADMIN MANAGEMENT
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight break-words">
                Manage Service Requests
              </h1>

              <p className="text-sm sm:text-base text-white/80 mt-3 max-w-2xl leading-relaxed">
                Review, filter, update, and manage citizen
                service requests from one centralized workspace.
              </p>

            </div>

            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-4 sm:px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full lg:w-fit shrink-0"
            >
              Browse Services

              <FiEye
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-7">

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <div className="flex items-center justify-between mt-2 gap-3">

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {totalServices}
              </h2>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FiTool size={20} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <div className="flex items-center justify-between mt-2 gap-3">

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {pendingServices}
              </h2>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <FiClock size={20} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <div className="flex items-center justify-between mt-2 gap-3">

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {progressServices}
              </h2>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <FiAlertCircle size={20} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <div className="flex items-center justify-between mt-2 gap-3">

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {resolvedServices}
              </h2>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FiCheckCircle size={20} />
              </div>

            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 sm:mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-red-700">

            <div className="flex items-start sm:items-center gap-3 min-w-0">

              <FiAlertCircle size={20} className="shrink-0 mt-0.5 sm:mt-0" />

              <span className="font-medium text-sm sm:text-base break-words">
                {error}
              </span>

            </div>

            <button
              onClick={() => loadServices(true)}
              className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none w-full sm:w-auto shrink-0"
            >
              <FiRefreshCw size={15} />
              Retry
            </button>

          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-7">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                <FiFilter size={19} />
              </div>

              <div className="min-w-0">

                <h2 className="font-bold text-base sm:text-lg text-slate-800">
                  Filters & Search
                </h2>

                <p className="text-xs sm:text-sm text-slate-500">
                  Narrow down service requests quickly
                </p>

              </div>

            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition w-full sm:w-auto"
              >
                <FiX size={15} />
                Clear Filters
              </button>
            )}

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search
              </label>

              <div className="relative group">

                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="ID, title, category, location..."
                  className="input input-sm sm:input-md w-full pl-10 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base"
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

              <select
                className="select select-sm sm:select-md w-full bg-slate-50 border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base"
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

            </div>

            {/* Category */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>

              <select
                className="select select-sm sm:select-md w-full bg-slate-50 border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base"
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

            </div>

            {/* Sort */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sort By
              </label>

              <select
                className="select select-sm sm:select-md w-full bg-slate-50 border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm sm:text-base"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="title">
                  Title A-Z
                </option>

              </select>

            </div>

          </div>
        </div>

        {/* Result Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <p className="text-sm text-slate-500">
              Showing
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">

              <span className="text-xl sm:text-2xl font-bold text-slate-800">
                {filteredServices.length}
              </span>

              <span className="text-sm sm:text-base text-slate-500">
                service request
                {filteredServices.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

          </div>

          <button
            onClick={() => loadServices(true)}
            className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:border-cyan-300 hover:text-cyan-600 hover:shadow-md transition-all w-full sm:w-auto"
            disabled={refreshing}
          >
            <FiRefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* Content */}
        {filteredServices.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl sm:rounded-3xl shadow-lg">

            <div className="text-center py-12 sm:py-16 px-4 sm:px-6">

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-cyan-50 text-cyan-400 flex items-center justify-center animate-[floating_4s_ease-in-out_infinite]">
                <FiTool size={32} className="sm:hidden" />
                <FiTool size={38} className="hidden sm:block" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-5 sm:mt-6">
                No Service Requests Found
              </h2>

              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                No service requests match your current
                search and filter settings.
              </p>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 sm:mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <FiX size={16} />
                  Clear Filters
                </button>
              )}

            </div>

          </div>

        ) : (

          <div className="space-y-3 sm:space-y-4">

            {filteredServices.map((service) => {

              const serviceId = service.id;

              const status =
                service.status || "pending";

              return (
                <div
                  key={serviceId}
                  className="group bg-white/90 backdrop-blur-xl border border-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >

                  <div className="p-4 sm:p-5 md:p-6">

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 sm:gap-6">

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border ${getStatusClass(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {formatStatus(status)}
                          </span>

                          <span className="inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 max-w-full break-words">
                            {service.category ||
                              "General"}
                          </span>

                        </div>

                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words group-hover:text-cyan-700 transition-colors">
                          {service.title ||
                            "Untitled Service Request"}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed line-clamp-2">
                          {service.description ||
                            "No description available."}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-4 md:gap-6 mt-4 sm:mt-5 text-xs sm:text-sm text-slate-500">

                          <span className="inline-flex items-start sm:items-center gap-2 min-w-0">

                            <FiMapPin
                              size={15}
                              className="text-cyan-500 shrink-0 mt-0.5 sm:mt-0"
                            />

                            <span className="break-words">
                              {service.location ||
                                "Location not available"}
                            </span>

                          </span>

                          {service.created_at && (
                            <span className="inline-flex items-start sm:items-center gap-2 min-w-0">

                              <FiCalendar
                                size={15}
                                className="text-blue-500 shrink-0 mt-0.5 sm:mt-0"
                              />

                              <span className="break-words">
                                {formatDate(
                                  service.created_at
                                )}
                              </span>

                            </span>
                          )}

                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-2 w-full xl:w-auto xl:min-w-[220px] 2xl:min-w-0">

                        {/* Admin Status */}
                        <select
                          className="select select-sm w-full sm:flex-1 xl:w-full 2xl:w-auto bg-slate-50 border-slate-200 font-medium focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 text-sm"
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(
                              serviceId,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingId === serviceId
                          }
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

                        {/* View */}
                        <Link
                          to={`/services/${serviceId}`}
                          className="group/view inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 font-semibold hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all w-full sm:flex-1 xl:w-full 2xl:w-auto"
                        >
                          <FiEye
                            size={16}
                            className="group-hover/view:scale-110 transition-transform"
                          />

                          View
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            openDeleteModal(serviceId)
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all w-full sm:flex-1 xl:w-full 2xl:w-auto"
                          disabled={
                            deletingId === serviceId
                          }
                        >
                          {deletingId === serviceId ? (
                            <>
                              <span className="loading loading-spinner loading-xs"></span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FiTrash2 size={16} />
                              Delete
                            </>
                          )}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Service Request"
        message="Are you sure you want to delete this service request? This action cannot be undone."
        confirmText={
          deletingId !== null
            ? "Deleting..."
            : "Delete"
        }
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={deletingId !== null}
      />

    </div>
  );
}

export default ManageServices;