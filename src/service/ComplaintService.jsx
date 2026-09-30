import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");

// ========================================
// TOKEN
// ========================================

function getToken() {
    return localStorage.getItem("token");
}


// ========================================
// USER
// ========================================

function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        return {};
    }
}


// ========================================
// CHECK ADMIN
// ========================================

function isAdmin() {
    const user = getCurrentUser();

    return (
        String(user?.role || "")
            .trim()
            .toLowerCase() === "admin"
    );
}


// ========================================
// HEADERS
// ========================================

function getHeaders(includeJson = false) {
    const token = getToken();

    const headers = {
        Accept: "application/json",
    };

    if (includeJson) {
        headers["Content-Type"] =
            "application/json";
    }

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    return headers;
}


// ========================================
// ERROR MESSAGE
// ========================================

function getErrorMessage(
    data,
    defaultMessage
) {
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
        response.headers.get(
            "content-type"
        ) || "";

    const text =
        await response.text();

    console.log(
        "================================"
    );

    console.log(
        "API URL:",
        response.url
    );

    console.log(
        "STATUS:",
        response.status
    );

    console.log(
        "CONTENT TYPE:",
        contentType
    );

    console.log(
        "SERVER RESPONSE:",
        text
    );

    console.log(
        "================================"
    );


    // ----------------------------------------
    // Empty response
    // ----------------------------------------

    if (!text.trim()) {
        if (!response.ok) {
            throw new Error(
                `${defaultMessage} (${response.status})`
            );
        }

        return null;
    }


    // ----------------------------------------
    // Parse JSON
    // ----------------------------------------

    let data;

    try {
        data = JSON.parse(text);
    } catch (error) {
        console.error(
            "JSON PARSE ERROR:",
            error
        );

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


    // ----------------------------------------
    // HTTP Error
    // ----------------------------------------

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


// =========================================================
// GET ALL COMPLAINTS
// ADMIN ONLY
// =========================================================

export async function getAllComplaints() {

    // Frontend protection
    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    const response = await fetch(
        `${API_URL}/complaints/all`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load all complaints"
    );
}


// =========================================================
// GET COMPLAINTS
//
// ADMIN  -> ALL COMPLAINTS
// USER   -> OWN COMPLAINTS
//
// NOTE:
// Backend also enforces this.
// =========================================================

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

    const params =
        new URLSearchParams();


    // ----------------------------------------
    // Search
    // ----------------------------------------

    if (search) {
        params.append(
            "search",
            search
        );
    }


    // ----------------------------------------
    // Category
    // ----------------------------------------

    if (category) {
        params.append(
            "category",
            category
        );
    }


    // ----------------------------------------
    // Status
    // ----------------------------------------

    if (status) {
        params.append(
            "status",
            status
        );
    }


    // ----------------------------------------
    // Priority
    // ----------------------------------------

    if (priority) {
        params.append(
            "priority",
            priority
        );
    }


    // ----------------------------------------
    // Start Date
    // ----------------------------------------

    if (startDate) {
        params.append(
            "start_date",
            startDate
        );
    }


    // ----------------------------------------
    // End Date
    // ----------------------------------------

    if (endDate) {
        params.append(
            "end_date",
            endDate
        );
    }


    // ----------------------------------------
    // Sorting
    // ----------------------------------------

    params.append(
        "sort_by",
        sortBy
    );

    params.append(
        "order",
        order
    );


    // ----------------------------------------
    // Pagination
    // ----------------------------------------

    params.append(
        "page",
        page
    );

    params.append(
        "page_size",
        pageSize
    );


    const queryString =
        params.toString();

    const url =
        queryString
            ? `${API_URL}/complaints?${queryString}`
            : `${API_URL}/complaints`;


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


// =========================================================
// GET SINGLE COMPLAINT
//
// ADMIN  -> ANY COMPLAINT
// USER   -> ONLY OWN COMPLAINT
// =========================================================

export async function getComplaintById(
    complaintId
) {

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }

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


// =========================================================
// GET MY COMPLAINTS
// NORMAL USER
// =========================================================

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


// =========================================================
// CREATE COMPLAINT
// AUTHENTICATED USER
// =========================================================

export async function createComplaint(
    complaintData
) {

    if (!complaintData) {
        throw new Error(
            "Complaint data is required"
        );
    }


    const body = {
        title:
            complaintData.title || "",

        description:
            complaintData.description || "",

        category:
            complaintData.category || "",

        location:
            complaintData.location || "",

        priority:
            complaintData.priority ||
            "medium",
    };


    console.log(
        "CREATE COMPLAINT DATA:",
        body
    );


    const response = await fetch(
        `${API_URL}/complaints`,
        {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(body),
        }
    );

    return parseResponse(
        response,
        "Failed to create complaint"
    );
}


// =========================================================
// UPDATE COMPLAINT
//
// IMPORTANT:
// Current backend allows complaint update
// only through ADMIN endpoint.
//
// Therefore this function is ADMIN ONLY.
// =========================================================

export async function updateComplaint(
    complaintId,
    complaintData
) {

    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }


    const body = {
        title:
            complaintData.title,

        description:
            complaintData.description,

        category:
            complaintData.category,

        location:
            complaintData.location,

        priority:
            complaintData.priority,

        status:
            complaintData.status,
    };


    // Remove undefined fields
    Object.keys(body).forEach(
        (key) => {
            if (
                body[key] === undefined
            ) {
                delete body[key];
            }
        }
    );


    const response = await fetch(
        `${API_URL}/admin/update_complaint/${complaintId}`,
        {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(body),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint"
    );
}


// =========================================================
// ADMIN UPDATE COMPLAINT
// =========================================================

export async function updateAdminComplaint(
    complaintId,
    complaintData
) {

    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }


    const response = await fetch(
        `${API_URL}/admin/update_complaint/${complaintId}`,
        {
            method: "PUT",
            headers: getHeaders(true),
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


// =========================================================
// UPDATE COMPLAINT PRIORITY
// ADMIN ONLY
// =========================================================

export async function updateComplaintPriority(
    complaintId,
    priority
) {

    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }


    if (
        ![
            "low",
            "medium",
            "high",
        ].includes(
            String(priority)
                .trim()
                .toLowerCase()
        )
    ) {
        throw new Error(
            "Invalid priority"
        );
    }


    const response = await fetch(
        `${API_URL}/admin/update_complaint/${complaintId}`,
        {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify({
                priority:
                    String(priority)
                        .trim()
                        .toLowerCase(),
            }),
        }
    );

    return parseResponse(
        response,
        "Failed to update complaint priority"
    );
}


// =========================================================
// DELETE COMPLAINT
// ADMIN ONLY
// =========================================================

export async function deleteComplaint(
    complaintId
) {

    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }


    const response = await fetch(
        `${API_URL}/admin/delete_complaint/${complaintId}`,
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


// =========================================================
// UPDATE COMPLAINT STATUS
// ADMIN ONLY
// =========================================================

export async function updateComplaintStatus(
    complaintId,
    status
) {

    if (!isAdmin()) {
        throw new Error(
            "Admin access required"
        );
    }

    if (!complaintId) {
        throw new Error(
            "Complaint ID is required"
        );
    }


    const allowedStatuses = [
        "pending",
        "in_progress",
        "resolved",
        "rejected",
    ];


    const normalizedStatus =
        String(status)
            .trim()
            .toLowerCase();


    if (
        !allowedStatuses.includes(
            normalizedStatus
        )
    ) {
        throw new Error(
            "Invalid complaint status"
        );
    }


    const params =
        new URLSearchParams();

    params.append(
        "status",
        normalizedStatus
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