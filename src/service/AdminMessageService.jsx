import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");

const AdminMessageService = {

    // =========================
    // SEND ADMIN MESSAGE
    // =========================

    sendMessage: async (title, message, token) => {
        const params = new URLSearchParams();

        params.append("title", title);
        params.append("message", message);

        const response = await fetch(
            `${API_URL}/admin/messages?${params.toString()}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                throw new Error(
                    data.detail
                        .map((item) => item.msg || "Invalid request")
                        .join(", ")
                );
            }

            throw new Error(
                data.detail || "Failed to send message"
            );
        }

        return data;
    },


    // =========================
    // GET ADMIN MESSAGES
    // =========================

    getAdminMessages: async (token) => {
        const response = await fetch(
            `${API_URL}/admin/messages`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                throw new Error(
                    data.detail
                        .map((item) => item.msg || "Invalid request")
                        .join(", ")
                );
            }

            throw new Error(
                data.detail || "Failed to load messages"
            );
        }

        return data;
    },


    // =========================
    // GET USER MESSAGES
    // =========================

    getUserMessages: async (token) => {
        const response = await fetch(
            `${API_URL}/messages`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                throw new Error(
                    data.detail
                        .map((item) => item.msg || "Invalid request")
                        .join(", ")
                );
            }

            throw new Error(
                data.detail || "Failed to load messages"
            );
        }

        return data;
    },


    // =========================
    // MARK MESSAGE AS READ
    // =========================

    markAsRead: async (messageId, token) => {
        const response = await fetch(
            `${API_URL}/messages/${messageId}/read`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                throw new Error(
                    data.detail
                        .map((item) => item.msg || "Invalid request")
                        .join(", ")
                );
            }

            throw new Error(
                data.detail || "Failed to mark message as read"
            );
        }

        return data;
    },


    // =========================
    // DELETE ADMIN MESSAGE
    // =========================

    deleteMessage: async (messageId, token) => {
        const response = await fetch(
            `${API_URL}/admin/messages/${messageId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                throw new Error(
                    data.detail
                        .map((item) => item.msg || "Invalid request")
                        .join(", ")
                );
            }

            throw new Error(
                data.detail || "Failed to delete message"
            );
        }

        return data;
    },

};

export default AdminMessageService;