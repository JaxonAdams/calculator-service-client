import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JWTService from "../services/JWTService";
import iconSvg from "../assets/icon.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [balance, setBalance] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(JWTService.isLoggedIn());
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserBalance();
        } else {
            setBalance(null);
        }
    }, [isLoggedIn]);

    const fetchUserBalance = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/balance`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWTService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch balance");
            }

            const data = await response.json();
            setBalance(parseFloat(data.balance));
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    }

    const handleLogout = () => {
        JWTService.removeToken();
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar bg-light">
            <div className="container-fluid">
                <a className="navbar-brand mb-0 h1" href="/">
                    <img
                        src={iconSvg}
                        alt="Premium Calculator"
                        width="30"
                        height="24"
                        className="d-inline-block align-text-bottom"
                    />
                    Premium Calculator
                </a>
                <div className="d-flex align-items-center">
                    {isLoggedIn ? (
                        <>
                            <button onClick={handleLogout} className="btn btn-outline-secondary" type="button">Logout</button>
                            {balance && 
                                <p className="p-2 px-4 mb-0 ms-5 bg-success-subtle rounded-start-pill fw-medium" style={{"letterSpacing": 1.3}}>
                                    {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </p>
                            }
                        </>
                    ) : (
                        <a href="/login" className="btn btn-primary">Login</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
