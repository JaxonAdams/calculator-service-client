import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to log in");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const result = await loginUser(username, password);
            console.log("Login successful:", result);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div id="login-page">
            <div className="container my-3 p-3 border border-dark rounded">
                <form id="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="input-username" className="form-label">Email address</label>
                        <input type="email" value={username} onChange={e => setUsername(e.target.value)} className="form-control" id="input-username" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="input-password" className="form-label">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="input-password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
