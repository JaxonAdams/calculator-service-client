import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import JWTService from "../services/JWTService";
import CalculatorAPIService from "../services/CalculatorAPIService";


const History = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [calcHistory, setCalcHistory] = useState([]);
    const [fullHistory, setFullHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [searchQuery, setSearchQuery] = useState("");
    const [updateBalance, setUpdateBalance] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!JWTService.isLoggedIn()) {
            navigate("/login");
        }
        
        handleFetchCalculationHistory(pageSize);

        // handle "admin mode" toggle
        const toggleAdminMode = () => {
            setIsAdmin(prevIsAdmin => !prevIsAdmin);
        };

        const handleKeyDown = (e) => {
            if (e.key === "m" && e.ctrlKey && !e.repeat) {
                e.preventDefault();
                toggleAdminMode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleFetchCalculationHistory = async (limit) => {
        try {
            const history = await CalculatorAPIService.fetchCalculationHistory(1, limit);
            setFullHistory(history["results"]);
            setCalcHistory(history["results"].slice(0, limit));
            setTotalPages(Math.ceil(history["total"] / limit));
        } catch (error) {
            console.error("Failed to fetch calculation history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setCalcHistory(
            getFilteredData(
                fullHistory,
                searchQuery
            ).slice((page - 1) * pageSize, page * pageSize)
        );
    };

    const handlePageSizeChange = (size) => {
        console.log(size);

        let filtered = getFilteredData(fullHistory, searchQuery);

        setPageSize(size);
        setTotalPages(Math.ceil(filtered.length / size));
        setCalcHistory(
            filtered.slice((currentPage - 1) * size, currentPage * size)
        );
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        const sortedHistory = fullHistory.sort((a, b) => {
            for (let subkey of key.split(".")) {
                a = a[subkey];
                b = b[subkey];
            }

            if (a < b) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a > b) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setFullHistory(sortedHistory);
        setCalcHistory(
            getFilteredData(
                sortedHistory,
                searchQuery
            ).slice((currentPage - 1) * pageSize, currentPage * pageSize)
        );
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return null;
    };

    const getFilteredData = (data, query) => {
        let filtered = data.filter((calculation) => {
            return Object.values(calculation).some((value) => {
                if (typeof value === "object") {
                    return Object.values(value).some((subvalue) => {
                        return subvalue.toString().toLowerCase().includes(query.toLowerCase());
                    });
                }
                return value.toString().toLowerCase().includes(query.toLowerCase());
            });
        });

        setTotalPages(Math.ceil(filtered.length / pageSize));
        return filtered;
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCalcHistory(
            getFilteredData(fullHistory, e.target.value).slice((currentPage - 1) * pageSize, currentPage * pageSize)
        );
    };

    const handleDelete = (id) => {
        console.log(`Deleting calculation ID ${id}...`);

        if (!window.confirm("Are you sure you want to delete this calculation?")) {
            return;
        }

        CalculatorAPIService.deleteCalculation(id)
            .then(() => {
                console.log(`Calculation ID ${id} deleted successfully!`);
                handleFetchCalculationHistory(pageSize);
                setUpdateBalance(true);
            })
            .catch(error => {
                console.error(`Failed to delete calculation ID ${id}:`, error);
            });
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

    const formatCurrency = (balance) => {
        return parseFloat(balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div id="history-page">
            <Header updateBalance={updateBalance} setUpdateBalance={setUpdateBalance} />
            <div className="container my-3 p-3 border border-dark rounded">
                <h1 className="p-3 mb-5 border-bottom border-3">History</h1>

                <input type="text" className="form-control mb-3" placeholder="Search" value={searchQuery} onChange={handleSearch} />

                <table className="table table-striped table-hover rounded">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort("date")}>
                                Date {renderSortIcon("date")}
                            </th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort("operation.type")} >
                                Operation {renderSortIcon("operation.type")}
                            </th>
                            <th scope="col">
                                Operands
                            </th>
                            <th scope="col">
                                Result
                            </th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort("operation.cost")}>
                                Cost {renderSortIcon("operation.cost")}
                            </th>
                            <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort("user_balance")}>
                                Remaining Balance {renderSortIcon("user_balance")}
                            </th>
                            {isAdmin && <th scope="col">Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading
                        ? 
                        <tr><td colSpan="6" className="text-center">Loading...</td></tr> 
                        :
                        calcHistory.map((calculation, index) => {
                            return (
                                <tr key={index}>
                                    <td>{formatDateStr(calculation["date"])}</td>
                                    <td>{calculation["operation"]["type"]}</td>
                                    <td>{formatOperands(calculation["calculation"]["operands"])}</td>
                                    <td>{calculation["calculation"]["result"]}</td>
                                    <td>{formatCurrency(calculation["operation"]["cost"])}</td>
                                    <td>{formatCurrency(calculation["user_balance"])}</td>
                                    {isAdmin && <td><button className="btn btn-danger" onClick={() => handleDelete(calculation["id"])}>Delete</button></td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <nav className="container-fluid d-flex justify-content-center">
                    <ul className="pagination mx-3">
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
                    <select className="form-select mb-3 mx-3" defaultValue={"10"} onChange={e => handlePageSizeChange(parseInt(e.target.value))} aria-label="Page select" style={{maxWidth: "75px"}}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                </nav>
            </div>
            <footer className="container-fluid d-flex justify-content-center">
                {isAdmin
                ? <p className="text-muted">Welcome, administrator!</p>
                : <p className="text-muted">Psst! Hey test user! Press <kbd>Ctrl</kbd> + <kbd>M</kbd> to toggle admin mode.</p>}
            </footer>
        </div>
    );
};

export default History;