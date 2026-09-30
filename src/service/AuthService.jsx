import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");


// =====================================================
// CLEAR AUTH DATA
// =====================================================

export function clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
}


// =====================================================
// FORMAT ERROR DETAIL
// =====================================================

function formatErrorDetail(detail) {
    if (!detail) {
        return null;
    }

    // Normal string error
    if (typeof detail === "string") {
        return detail;
    }

    // FastAPI validation error array
    if (Array.isArray(detail)) {
        return detail
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (item?.msg) {
                    return item.msg;
                }

                if (item?.detail) {
                    return item.detail;
                }

                return JSON.stringify(item);
            })
            .join(", ");
    }

    // Object error
    if (typeof detail === "object") {
        if (detail.msg) {
            return detail.msg;
        }

        if (detail.message) {
            return detail.message;
        }

        if (detail.detail) {
            return detail.detail;
        }

        return JSON.stringify(detail);
    }

    return String(detail);
}


// =====================================================
// SAFE RESPONSE PARSER
// =====================================================

async function parseResponse(response) {
    const contentType =
        response.headers.get("content-type") || "";

    let data = {};

    if (contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch {
            data = {};
        }
    } else {
        try {
            const text = await response.text();

            data = text
                ? { detail: text }
                : {};
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        const errorMessage =
            formatErrorDetail(data?.detail) ||
            formatErrorDetail(data?.message) ||
            `Request failed with status ${response.status}`;

        throw new Error(errorMessage);
    }

    return data;
}


// =====================================================
// LOGIN
// Username OR Email + Password
// =====================================================

export async function loginUser(
    identifier,
    password
) {
    const cleanIdentifier =
        identifier?.trim() || "";

    if (!cleanIdentifier) {
        throw new Error(
            "Username or email is required"
        );
    }

    if (!password) {
        throw new Error(
            "Password is required"
        );
    }

    /*
     * IMPORTANT:
     *
     * Current FastAPI backend:
     *
     * def login(username: str, password: str, db: ...)
     *
     * Therefore username/password are QUERY PARAMETERS,
     * not form-data.
     */

    const params = new URLSearchParams({
        username: cleanIdentifier,
        password: password,
    });

    const response = await fetch(
        `${API_URL}/login?${params.toString()}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data = await parseResponse(response);


    // =================================================
    // SAVE ACCESS TOKEN
    // =================================================

    if (!data.access_token) {
        throw new Error(
            "Access token was not returned by server"
        );
    }

    localStorage.setItem(
        "token",
        data.access_token
    );


    // =================================================
    // SAVE REFRESH TOKEN
    // =================================================

    if (data.refresh_token) {
        localStorage.setItem(
            "refresh_token",
            data.refresh_token
        );
    }


    // =================================================
    // SAVE USER
    // =================================================

    const user = {
        id: data.user_id,
        username: data.username,
        email: data.email,

        firstname:
            data.firstname ||
            data.first_name ||
            "",

        lastname:
            data.lastname ||
            data.last_name ||
            "",

        role: data.role || "user",
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    // =================================================
    // SAVE ROLE
    // =================================================

    if (data.role) {
        localStorage.setItem(
            "role",
            data.role
        );
    }


    return data;
}


// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

export async function refreshAccessToken() {
    const refreshToken =
        localStorage.getItem("refresh_token");

    if (!refreshToken) {
        clearAuthData();

        throw new Error(
            "Refresh token not found"
        );
    }

    const response = await fetch(
        `${API_URL}/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        }
    );

    const data = await parseResponse(response);

    if (!data.access_token) {
        clearAuthData();

        throw new Error(
            "New access token was not returned"
        );
    }

    localStorage.setItem(
        "token",
        data.access_token
    );

    return data.access_token;
}


// =====================================================
// REGISTER USER
// =====================================================

export async function registerUser(userData) {
    const cleanUserData = {
        username:
            userData.username?.trim(),

        email:
            userData.email?.trim(),

        firstname:
            userData.firstname?.trim(),

        lastname:
            userData.lastname?.trim(),

        password:
            userData.password,
    };

    const response = await fetch(
        `${API_URL}/createuser`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(
                cleanUserData
            ),
        }
    );

    const data =
        await parseResponse(response);

    return data;
}


// =====================================================
// FORGOT PASSWORD
// Username + New Password
// =====================================================

export async function forgotPassword(
    username,
    newPassword
) {
    const response = await fetch(
        `${API_URL}/forgotpassword`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                username:
                    username?.trim(),

                new_password:
                    newPassword,
            }),
        }
    );

    const data =
        await parseResponse(response);

    return data;
}