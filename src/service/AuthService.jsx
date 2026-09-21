import baseUrl from "./BaseUrl";

const API_URL = baseUrl.replace(/\/+$/, "");

// =====================================================
// LOGIN
// Username OR Email + Password
// =====================================================

export async function loginUser(identifier, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: new URLSearchParams({
            username: identifier.trim(),
            password: password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Invalid username/email or password"
        );
    }

    // Save access token
    localStorage.setItem("token", data.access_token);

    // Save refresh token
    if (data.refresh_token) {
        localStorage.setItem(
            "refresh_token",
            data.refresh_token
        );
    }

    // Save user information
    const user = {
        id: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role,
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    return data;
}


// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

export async function refreshAccessToken() {
    const refreshToken =
        localStorage.getItem("refresh_token");

    if (!refreshToken) {
        throw new Error("Refresh token not found");
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

    const data = await response.json();

    if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        throw new Error(
            data.detail || "Session expired"
        );
    }

    // Save new access token
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
    const response = await fetch(
        `${API_URL}/createuser`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Registration failed"
        );
    }

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
                username: username,
                new_password: newPassword,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Password reset failed"
        );
    }

    return data;
}