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

    const formatDateStr = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const formatOperands = (operands) => {
        let formatted = [];
        for (let i = 0; i < operands.length; i++) {
            let operand = operands[i];

            if (typeof operand === "number") {
                formatted.push(operand);
                continue;
            }

            // if operand type is object-literal, format it as a json string
            if (typeof operand === "object") {
                // I may come back later to include the object in a nice format
                formatted.push("-")
                continue;
            }
        }

        return formatted.join(", ");
    };

    const formatBalance = (balance) => {
        return parseFloat(balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div id="history-page">
            <Header />
            <div className="container my-3 p-3 border border-dark rounded">
                <h1 className="p-3 mb-5 border-bottom border-3">History</h1>
                <table className="table table-striped table-hover rounded">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Operation</th>
                            <th scope="col">Operands</th>
                            <th scope="col">Result</th>
                            <th scope="col">Remaining Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calcHistory.map((calculation, index) => {
                            return (
                                <tr key={index}>
                                    <td>{formatDateStr(calculation["date"])}</td>
                                    <td>{calculation["operation"]["type"]}</td>
                                    <td>{formatOperands(calculation["calculation"]["operands"])}</td>
                                    <td>{calculation["calculation"]["result"]}</td>
                                    <td>{formatBalance(calculation["user_balance"])}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;