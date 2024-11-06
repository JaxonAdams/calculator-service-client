import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import JWTService from "../services/JWTService";
import CalculatorAPIService from "../services/CalculatorAPIService";


const History = () => {
    const [calcHistory, setCalcHistory] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!JWTService.isLoggedIn()) {
            navigate("/login");
        }
        handleFetchCalculationHistory();
    }, []);

    const handleFetchCalculationHistory = async () => {
        const history = await CalculatorAPIService.fetchCalculationHistory();

        console.log(history["metadata"]);

        setCalcHistory(history["results"]);
        console.log(history["results"]);
    };

    return (
        <div id="history-page">
            <Header />
            <div className="container my-3 p-3 border border-dark rounded">
                <h1>History</h1>
            </div>
        </div>
    );
};

export default History;