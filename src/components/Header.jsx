import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JWTService from "../services/JWTService";
import iconSvg from "../assets/icon.svg";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(JWTService.isLoggedIn());
    }, []);

    const handleLogout = () => {
        JWTService.removeToken();
        setIsLoggedIn(false);
        navigate("/login");
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
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="btn btn-outline-secondary" type="button">Logout</button>
                ) : (
                    <a href="/login" className="btn btn-primary">Login</a>
                )}
            </div>
        </nav>
    );
};

export default Header;
