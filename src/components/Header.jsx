import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import JWTService from "../services/JWTService";
import CalculatorAPIService from "../services/CalculatorAPIService";

import iconSvg from "../assets/icon.svg";

const Header = ({ updateBalance, setUpdateBalance }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [balance, setBalance] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(JWTService.isLoggedIn());
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            handleFetchUserBalance();
        } else {
            setBalance(null);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (updateBalance) {
            handleFetchUserBalance();
            setUpdateBalance(false);
        }
    }, [updateBalance]);

    const handleFetchUserBalance = async () => {
        const balance = await CalculatorAPIService.fetchUserBalance();
        setBalance(balance);
    };

    const handleLogout = () => {
        JWTService.removeToken();
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid d-flex justify-content-space-around">
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

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-2 d-flex align-items-center">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        {isLoggedIn && (
                            <li className="nav-item mx-2 d-flex align-items-center">
                                <a className="nav-link" href="/history">History</a>
                            </li>
                        )}
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item mx-2 d-flex align-items-center">
                                    <button onClick={handleLogout} className="nav-link my-2" type="button">Logout</button>
                                </li>
                                <li className="nav-item mx-2 d-flex align-items-center">
                                    {balance && 
                                        <p className="py-2 px-4 my-2 bg-success-subtle rounded-pill fw-medium text-center" style={{"letterSpacing": 1.3}}>
                                            {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </p>
                                    }
                                </li>
                            </>
                        ) : (
                        <li className="nav-item mx-2 d-flex align-items-center">
                            <a href="/login" className="nav-link my-2">Login</a>
                        </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
