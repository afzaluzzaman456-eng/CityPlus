import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");

function getToken() {
    return localStorage.getItem("token");
}

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
        return data.detail.msg || JSON.stringify(data.detail);
    }

    return String(data.detail);
}

async function parseResponse(response, defaultMessage) {
    const contentType =
        response.headers.get("content-type") || "";

    const text = await response.text();

    console.log("================================");
    console.log("SERVICE API URL:", response.url);
    console.log("STATUS:", response.status);
    console.log("CONTENT TYPE:", contentType);
    console.log("SERVER RESPONSE:", text);
    console.log("================================");

    if (!text.trim()) {
        if (!response.ok) {
            throw new Error(
                `${defaultMessage} (${response.status})`
            );
        }

        return null;
    }

    let data;

    try {
        data = JSON.parse(text);
    } catch (error) {
        console.error("SERVICE JSON PARSE ERROR:", error);

        if (
            text.trim().toLowerCase().startsWith("<!doctype") ||
            text.trim().toLowerCase().startsWith("<html")
        ) {
            throw new Error(
                `Backend returned HTML instead of JSON. Status: ${response.status}`
            );
        }

        throw new Error(
            `Backend returned invalid JSON. Status: ${response.status}`
        );
    }

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

/* =========================
   GET ALL SERVICES
========================= */

export async function getAllServices() {
    const response = await fetch(
        `${API_URL}/services/all`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load service requests"
    );
}

/* =========================
   GET SERVICES
========================= */

export async function getServices({
    search = "",
    category = "",
    status = "",
    startDate = "",
    endDate = "",
    sortBy = "created_at",
    order = "desc",
    page = 1,
    pageSize = 6,
} = {}) {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (category) {
        params.append("category", category);
    }

    if (status) {
        params.append("status", status);
    }

    if (startDate) {
        params.append("start_date", startDate);
    }

    if (endDate) {
        params.append("end_date", endDate);
    }

    params.append("sort_by", sortBy);
    params.append("order", order);
    params.append("page", page);
    params.append("page_size", pageSize);

    const url = `${API_URL}/services?${params.toString()}`;

    console.log("SERVICE API URL:", url);
    console.log("SERVICE TOKEN:", getToken());

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    return parseResponse(
        response,
        "Failed to load service requests"
    );
}

/* =========================
   GET SERVICE BY ID
========================= */

export async function getServiceById(serviceId) {
    const response = await fetch(
        `${API_URL}/services/${serviceId}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load service request"
    );
}

/* =========================
   GET MY SERVICES
========================= */

export async function getMyServices() {
    const response = await fetch(
        `${API_URL}/services/my`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to load your service requests"
    );
}

/* =========================
   CREATE SERVICE REQUEST
========================= */

export async function createServiceRequest(serviceData) {
    const params = new URLSearchParams();

    params.append(
        "title",
        serviceData.title || ""
    );

    params.append(
        "description",
        serviceData.description || ""
    );

    params.append(
        "category",
        serviceData.category || ""
    );

    params.append(
        "location",
        serviceData.location || ""
    );

    const response = await fetch(
        `${API_URL}/services?${params.toString()}`,
        {
            method: "POST",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to create service request"
    );
}

/* =========================
   UPDATE SERVICE REQUEST
========================= */

export async function updateServiceRequest(
    serviceId,
    serviceData
) {
    const params = new URLSearchParams();

    params.append(
        "title",
        serviceData.title || ""
    );

    params.append(
        "description",
        serviceData.description || ""
    );

    params.append(
        "category",
        serviceData.category || ""
    );

    params.append(
        "location",
        serviceData.location || ""
    );

    const response = await fetch(
        `${API_URL}/services/${serviceId}?${params.toString()}`,
        {
            method: "PUT",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to update service request"
    );
}

/* =========================
   DELETE SERVICE REQUEST
========================= */

export async function deleteServiceRequest(serviceId) {
    const response = await fetch(
        `${API_URL}/services/${serviceId}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to delete service request"
    );
}

/* =========================
   UPDATE SERVICE STATUS
========================= */

export async function updateServiceStatus(
    serviceId,
    status
) {
    const params = new URLSearchParams();

    params.append("status", status);

    const response = await fetch(
        `${API_URL}/admin/service/status/${serviceId}?${params.toString()}`,
        {
            method: "PUT",
            headers: getHeaders(),
        }
    );

    return parseResponse(
        response,
        "Failed to update service status"
    );
}