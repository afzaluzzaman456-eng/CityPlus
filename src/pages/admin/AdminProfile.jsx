import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminMessageService from "../../service/AdminMessageService";

const AdminProfile = () => {
    const { accessToken } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);

    const loadMessages = async () => {
        try {
            setLoadingMessages(true);

            const data = await AdminMessageService.getAdminMessages(
                accessToken
            );

            setMessages(data);
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            loadMessages();
        }
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await AdminMessageService.sendMessage(
                title,
                message,
                accessToken
            );

            setTitle("");
            setMessage("");

            await loadMessages();

            alert("Message sent successfully!");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (messageId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await AdminMessageService.deleteMessage(
                messageId,
                accessToken
            );

            await loadMessages();

            alert("Message deleted successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 px-3 sm:px-5 md:px-6 py-6 sm:py-8 md:py-10">

            <div className="max-w-5xl mx-auto">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-6 sm:mb-8">

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content">
                        Admin Profile
                    </h1>

                    <p className="text-sm sm:text-base text-base-content/60 mt-2 leading-6 max-w-2xl">
                        Communicate with CityPulse users and provide important
                        updates.
                    </p>

                </div>


                {/* =========================
                    SEND MESSAGE
                ========================= */}

                <div className="card bg-base-100 shadow-xl rounded-2xl sm:rounded-3xl">

                    <div className="card-body p-4 sm:p-6 md:p-8">

                        <div className="mb-4 sm:mb-5">

                            <h2 className="card-title text-xl sm:text-2xl">
                                How Can I Help?
                            </h2>

                            <p className="text-sm sm:text-base text-base-content/60 mt-1 leading-6">
                                Send an important message or update to CityPulse
                                users.
                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* Title */}

                            <div className="form-control w-full mb-4 sm:mb-5">

                                <label className="label">
                                    <span className="label-text text-sm sm:text-base font-semibold">
                                        Message Title
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter message title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    className="input input-bordered w-full text-sm sm:text-base min-h-11 sm:min-h-12"
                                    required
                                />

                            </div>


                            {/* Message */}

                            <div className="form-control w-full">

                                <label className="label">
                                    <span className="label-text text-sm sm:text-base font-semibold">
                                        Message
                                    </span>
                                </label>

                                <textarea
                                    placeholder="Write your message for users..."
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    className="textarea textarea-bordered w-full min-h-36 sm:min-h-40 md:min-h-44 text-sm sm:text-base leading-6"
                                    required
                                ></textarea>

                            </div>


                            {/* Button */}

                            <div className="flex flex-col sm:flex-row justify-end mt-5 sm:mt-6">

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full sm:w-auto px-6 sm:px-8 min-h-11 sm:min-h-12"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>


                {/* =========================
                    PREVIOUS MESSAGES
                ========================= */}

                <div className="card bg-base-100 shadow-xl mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl">

                    <div className="card-body p-4 sm:p-6 md:p-8">

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">

                            <div className="min-w-0">

                                <h2 className="card-title text-lg sm:text-xl md:text-2xl">
                                    Previous Messages
                                </h2>

                                <p className="text-xs sm:text-sm text-base-content/60 mt-1 leading-5">
                                    Messages previously sent to CityPulse users.
                                </p>

                            </div>

                            <div className="badge badge-primary self-start sm:self-auto whitespace-nowrap">
                                {messages.length} Messages
                            </div>

                        </div>


                        {/* Divider */}

                        <div className="divider my-2"></div>


                        {/* =========================
                            LOADING
                        ========================= */}

                        {loadingMessages && (
                            <div className="flex justify-center py-10 sm:py-12">

                                <span className="loading loading-spinner loading-lg"></span>

                            </div>
                        )}


                        {/* =========================
                            NO MESSAGES
                        ========================= */}

                        {!loadingMessages && messages.length === 0 && (
                            <div className="text-center py-10 sm:py-12">

                                <div className="text-4xl sm:text-5xl mb-4">
                                    📢
                                </div>

                                <h3 className="font-semibold text-base sm:text-lg">
                                    No messages yet
                                </h3>

                                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                                    Your sent messages will appear here.
                                </p>

                            </div>
                        )}


                        {/* =========================
                            MESSAGES
                        ========================= */}

                        {!loadingMessages && messages.length > 0 && (
                            <div className="space-y-3 sm:space-y-4">

                                {messages.map((item) => (

                                    <div
                                        key={item.id}
                                        className="border border-base-300 rounded-xl sm:rounded-2xl p-4 sm:p-5"
                                    >

                                        <div className="flex flex-col gap-4">

                                            {/* Message Content */}

                                            <div className="min-w-0">

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

                                                    <h3 className="font-bold text-base sm:text-lg break-words">
                                                        {item.title}
                                                    </h3>

                                                    <span className="badge badge-success badge-sm self-start sm:self-auto whitespace-nowrap">
                                                        Sent
                                                    </span>

                                                </div>


                                                <p className="text-sm sm:text-base text-base-content/70 mt-3 leading-6 break-words whitespace-pre-wrap">
                                                    {item.message}
                                                </p>


                                                <p className="text-xs sm:text-sm text-base-content/50 mt-3 sm:mt-4 break-words">
                                                    {item.created_at
                                                        ? new Date(
                                                            item.created_at
                                                        ).toLocaleString()
                                                        : "No date"}
                                                </p>

                                            </div>


                                            {/* Delete */}

                                            <div className="flex justify-end">

                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="btn btn-sm btn-error btn-outline w-full sm:w-auto"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminProfile;