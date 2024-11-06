import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import JWTService from "../services/JWTService";


const History = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!JWTService.isLoggedIn()) {
            navigate("/login");
        }
    }, []);

    return (
        <div id="history-page">
            <Header />
            <div className="container my-3 p-3 border border-dark rounded">
                <h1>History</h1>
                <p>Coming soon...</p>
            </div>
        </div>
    );
};

export default History;