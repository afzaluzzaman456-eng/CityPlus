import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");

// ========================================
// TOKEN
// ========================================

function getToken() {
    return localStorage.getItem("token");
}

// ========================================
// HEADERS
// ========================================

function getHeaders() {
    const token = getToken();

    const headers = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

// ========================================
// ERROR MESSAGE
// ========================================

function getErrorMessage(data, defaultMessage) {
    if (!data) {
        return defaultMessage;
    }

    if (typeof data === "string") {
        return data;
    }

    if (!data.detail) {
        return defaultMessage;
    }

    if (typeof data.detail === "string") {
        return data.detail;
    }

    if (Array.isArray(data.detail)) {
        return data.detail
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (item?.msg) {
                    return item.msg;
                }

                return JSON.stringify(item);
            })
            .join(", ");
    }

    if (typeof data.detail === "object") {
        return (
            data.detail.msg ||
            JSON.stringify(data.detail)
        );
    }

    return String(data.detail);
}

// ========================================
// RESPONSE HANDLER
// ========================================

async function parseResponse(
    response,
    defaultMessage
) {
    const contentType =
        response.headers.get("content-type") || "";

    const text = await response.text();

    console.log("================================");
    console.log("API URL:", response.url);
    console.log("STATUS:", response.status);
    console.log("CONTENT TYPE:", contentType);
    console.log("SERVER RESPONSE:", text);
    console.log("================================");

    // Empty response
    if (!text.trim()) {
        if (!response.ok) {
            throw new Error(
                `${defaultMessage} (${response.status})`
            );
        }

        return null;
    }

    let data;

    // Try JSON manually
    try {
        data = JSON.parse(text);
    } catch (error) {
        console.error(
            "JSON PARSE ERROR:",
            error
        );

        // HTML response
        if (
            text
                .trim()
                .toLowerCase()
                .startsWith("<!doctype") ||
            text
                .trim()
                .toLowerCase()
                .startsWith("<html")
        ) {
            throw new Error(
                `Backend returned HTML instead of JSON. Status: ${response.status}`
            );
        }

        throw new Error(
            `Backend returned invalid JSON. Status: ${response.status}`
        );
    }

    // HTTP error
    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                `${defaultMessage} (${response.status})`
            )
        );
    }

    return data;
}

// ========================================
// GET ALL COMPLAINTS
// ========================================

export async function getAllComplaints() {
    const response = await fetch(
        `${API_URL}/complaints/all`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load complaints"
    );
}

// ========================================
// GET COMPLAINTS
// ========================================

export async function getComplaints({
    search = "",
    category = "",
    status = "",
    priority = "",
    startDate = "",
    endDate = "",
    sortBy = "created_at",
    order = "desc",
    page = 1,
    pageSize = 5,
} = {}) {
    const params = new URLSearchParams();

    if (search) {
        params.append(
            "search",
            search
        );
    }

    if (category) {
        params.append(
            "category",
            category
        );
    }

    if (status) {
        params.append(
            "status",
            status
        );
    }

    if (priority) {
        params.append(
            "priority",
            priority
        );
    }

    if (startDate) {
        params.append(
            "start_date",
            startDate
        );
    }

    if (endDate) {
        params.append(
            "end_date",
            endDate
        );
    }

    params.append(
        "sort_by",
        sortBy
    );

    params.append(
        "order",
        order
    );

    params.append(
        "page",
        page
    );

    params.append(
        "page_size",
        pageSize
    );

    const url =
        `${API_URL}/complaints?${params.toString()}`;

    console.log(
        "COMPLAINT API URL:",
        url
    );

    console.log(
        "COMPLAINT TOKEN:",
        getToken()
    );

    const response = await fetch(
        url,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load complaints"
    );
}

// ========================================
// GET SINGLE COMPLAINT
// ========================================

export async function getComplaintById(
    complaintId
) {
    const response = await fetch(
        `${API_URL}/complaints/${complaintId}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load complaint"
    );
}

// ========================================
// GET MY COMPLAINTS
// ========================================

export async function getMyComplaints() {
    const response = await fetch(
        `${API_URL}/complaints/my`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load your complaints"
    );
}

// ========================================
// CREATE COMPLAINT
// ========================================

export async function createComplaint(
    complaintData
) {
    const params = new URLSearchParams();

    params.append(
        "title",
        complaintData.title || ""
    );

    params.append(
        "description",
        complaintData.description || ""
    );

    params.append(
        "category",
        complaintData.category || ""
    );

    params.append(
        "location",
        complaintData.location || ""
    );

    const response = await fetch(
        `${API_URL}/complaints?${params.toString()}`,
        {
            method: "POST",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to create complaint"
    );
}

// ========================================
// UPDATE COMPLAINT
// ========================================

export async function updateComplaint(
    complaintId,
    complaintData
) {
    const params = new URLSearchParams();

    params.append(
        "title",
        complaintData.title || ""
    );

    params.append(
        "description",
        complaintData.description || ""
    );

    params.append(
        "category",
        complaintData.category || ""
    );

    params.append(
        "location",
        complaintData.location || ""
    );

    const response = await fetch(
        `${API_URL}/complaints/${complaintId}?${params.toString()}`,
        {
            method: "PUT",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint"
    );
}

// ========================================
// ADMIN UPDATE COMPLAINT
// ========================================

export async function updateAdminComplaint(
    complaintId,
    complaintData
) {
    const response = await fetch(
        `${API_URL}/admin/update_complaint/${complaintId}`,
        {
            method: "PUT",
            headers: {
                ...getHeaders(),
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(
                complaintData
            ),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint"
    );
}

// ========================================
// UPDATE PRIORITY
// ========================================

export async function updateComplaintPriority(
    complaintId,
    priority
) {
    const response = await fetch(
        `${API_URL}/admin/update_complaint/${complaintId}`,
        {
            method: "PUT",
            headers: {
                ...getHeaders(),
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                priority: priority,
            }),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint priority"
    );
}

// ========================================
// DELETE COMPLAINT
// ========================================

export async function deleteComplaint(
    complaintId
) {
    const response = await fetch(
        `${API_URL}/complaints/${complaintId}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to delete complaint"
    );
}

// ========================================
// UPDATE STATUS
// ========================================

export async function updateComplaintStatus(
    complaintId,
    status
) {
    const params = new URLSearchParams();

    params.append(
        "status",
        status
    );

    const response = await fetch(
        `${API_URL}/admin/complaint/status/${complaintId}?${params.toString()}`,
        {
            method: "PUT",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint status"
    );
}