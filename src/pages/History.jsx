import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import JWTService from "../services/JWTService";
import CalculatorAPIService from "../services/CalculatorAPIService";


const History = () => {
    const [calcHistory, setCalcHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!JWTService.isLoggedIn()) {
            navigate("/login");
        }
        handleFetchCalculationHistory(currentPage, 10);
    }, [currentPage]);

    const handleFetchCalculationHistory = async (page, limit) => {
        const history = await CalculatorAPIService.fetchCalculationHistory(page, limit);
        setCalcHistory(history["results"]);
        setTotalPages(Math.ceil(history["total"] / limit));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

            if (typeof operand === "object") {
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
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" style={{ textDecoration: 'none' }} onClick={() => handlePageChange(currentPage - 1)}>
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" style={{ textDecoration: 'none' }} onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" style={{ textDecoration: 'none' }} onClick={() => handlePageChange(currentPage + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default History;