import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../service/UserService";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            setError(error.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleDelete(userId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(userId);
            setError("");

            await deleteUser(userId);

            setUsers((currentUsers) =>
                currentUsers.filter((user) => user.id !== userId)
            );
        } catch (error) {
            setError(error.message || "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center px-4">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-5 sm:space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
                    Manage Users
                </h1>

                <p className="mt-1 text-sm sm:text-base text-base-content/60">
                    View and manage registered users.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-error shadow-sm">
                    <span className="text-sm sm:text-base break-words">
                        {error}
                    </span>
                </div>
            )}

            {/* Statistics */}
            <div className="w-full">
                <div className="stats stats-vertical sm:stats-horizontal w-full shadow border border-base-200">
                    <div className="stat px-4 sm:px-6 py-4 sm:py-5">
                        <div className="stat-title text-sm">
                            Total Users
                        </div>

                        <div className="stat-value text-3xl sm:text-4xl">
                            {users.length}
                        </div>

                        <div className="stat-desc text-xs sm:text-sm">
                            Registered users
                        </div>
                    </div>
                </div>
            </div>

            {/* Users */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">

                <div className="card-body p-0">

                    {users.length === 0 ? (

                        /* Empty State */
                        <div className="flex min-h-[220px] sm:min-h-[250px] items-center justify-center p-5 sm:p-6">
                            <div className="text-center">

                                <div className="text-4xl sm:text-5xl mb-3">
                                    👥
                                </div>

                                <h2 className="text-lg sm:text-xl font-semibold">
                                    No users found
                                </h2>

                                <p className="mt-2 text-sm sm:text-base text-base-content/60">
                                    There are no registered users yet.
                                </p>

                            </div>
                        </div>

                    ) : (

                        <>
                            {/* ================= MOBILE / TABLET CARD VIEW ================= */}
                            <div className="block lg:hidden p-3 sm:p-5 space-y-3 sm:space-y-4">

                                {users.map((user) => {

                                    const fullName =
                                        `${user.firstname || ""} ${user.lastname || ""}`.trim();

                                    const isAdmin = user.role === "admin";

                                    return (
                                        <div
                                            key={user.id}
                                            className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm"
                                        >

                                            {/* User Header */}
                                            <div className="flex items-start justify-between gap-3">

                                                <div className="flex items-start gap-3 min-w-0">

                                                    {/* Avatar */}
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                                        {(fullName || user.username || "U")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <h3 className="font-semibold text-base sm:text-lg break-words">
                                                            {fullName || "No name"}
                                                        </h3>

                                                        <p className="text-sm text-base-content/60 break-all">
                                                            @{user.username}
                                                        </p>

                                                    </div>

                                                </div>

                                                <span className="text-xs sm:text-sm text-base-content/50 shrink-0">
                                                    #{user.id}
                                                </span>

                                            </div>


                                            {/* User Details */}
                                            <div className="mt-4 space-y-3">

                                                {/* Email */}
                                                <div>
                                                    <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                                                        Email
                                                    </p>

                                                    <p className="text-sm sm:text-base mt-1 break-all">
                                                        {user.email}
                                                    </p>
                                                </div>


                                                {/* Role + Status */}
                                                <div className="grid grid-cols-2 gap-3">

                                                    <div>
                                                        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                                                            Role
                                                        </p>

                                                        <span
                                                            className={`badge ${
                                                                isAdmin
                                                                    ? "badge-primary"
                                                                    : "badge-ghost"
                                                            } badge-sm sm:badge-md`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </div>


                                                    <div>
                                                        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                                                            Status
                                                        </p>

                                                        {user.is_active ? (
                                                            <span className="badge badge-success badge-outline badge-sm sm:badge-md">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-error badge-outline badge-sm sm:badge-md">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>


                                                {/* Action */}
                                                <div className="pt-2 border-t border-base-200">

                                                    {isAdmin ? (

                                                        <div className="flex items-center justify-between gap-3">

                                                            <span className="text-sm text-base-content/50">
                                                                Admin Account
                                                            </span>

                                                            <span className="badge badge-primary badge-outline">
                                                                Protected
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        <button
                                                            className="btn btn-error btn-sm w-full"
                                                            onClick={() =>
                                                                handleDelete(user.id)
                                                            }
                                                            disabled={
                                                                deletingId === user.id
                                                            }
                                                        >
                                                            {deletingId === user.id ? (
                                                                <>
                                                                    <span className="loading loading-spinner loading-sm"></span>
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                "Delete User"
                                                            )}
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>


                            {/* ================= DESKTOP TABLE ================= */}
                            <div className="hidden lg:block overflow-x-auto">

                                <table className="table w-full">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th className="text-right">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.map((user) => {

                                            const fullName =
                                                `${user.firstname || ""} ${user.lastname || ""}`.trim();

                                            const isAdmin =
                                                user.role === "admin";

                                            return (
                                                <tr key={user.id}>

                                                    {/* ID */}
                                                    <td>
                                                        {user.id}
                                                    </td>


                                                    {/* User */}
                                                    <td>

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                                                {(fullName ||
                                                                    user.username ||
                                                                    "U")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <div className="font-semibold">
                                                                    {fullName ||
                                                                        "No name"}
                                                                </div>

                                                                <div className="text-sm text-base-content/60">
                                                                    @{user.username}
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* Email */}
                                                    <td>
                                                        <span className="break-all">
                                                            {user.email}
                                                        </span>
                                                    </td>


                                                    {/* Role */}
                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                                isAdmin
                                                                    ? "badge-primary"
                                                                    : "badge-ghost"
                                                            }`}
                                                        >
                                                            {user.role}
                                                        </span>

                                                    </td>


                                                    {/* Status */}
                                                    <td>

                                                        {user.is_active ? (
                                                            <span className="badge badge-success badge-outline">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-error badge-outline">
                                                                Inactive
                                                            </span>
                                                        )}

                                                    </td>


                                                    {/* Action */}
                                                    <td className="text-right">

                                                        {isAdmin ? (

                                                            <span className="text-sm text-base-content/50">
                                                                Protected
                                                            </span>

                                                        ) : (

                                                            <button
                                                                className="btn btn-error btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    user.id
                                                                }
                                                            >
                                                                {deletingId ===
                                                                user.id ? (
                                                                    <>
                                                                        <span className="loading loading-spinner loading-sm"></span>
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    "Delete"
                                                                )}
                                                            </button>

                                                        )}

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

        </div>
    );
}

export default ManageUsers;