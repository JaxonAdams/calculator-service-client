import { useEffect, useState } from "react";

import Header from "../components/Header";

import { formatOperator, formatCurrency } from "../utils/format_util";
import CalculatorAPIService from "../services/CalculatorAPIService";

const Calculator = () => {
    const [availableOps, setAvailableOps] = useState([]);
    const [selectedOp, setSelectedOp] = useState(null);

    useEffect(() => {
        fetchAvailableOps();
    }, []);

    const fetchAvailableOps = async () => {
        try {
            const response = await CalculatorAPIService.fetchAvailableOps();
            setAvailableOps(response.results);
            setSelectedOp(response.results[0]);  // default to first available operation
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpSelect = (opType) => {
        const userSelectedOp = availableOps.find(op => op.type === opType);
        setSelectedOp(userSelectedOp);
    };

    return (
        <div className="calculator">
            <Header updateBalance={false} setUpdateBalance={() => {}} />
            <div id="run-calculation" className="container my-3 p-3 border border-dark rounded">
                <h2 className="text-center">Run a Calculation</h2>
                <form className="calculation-form">
                    <label htmlFor="operation-type" className="form-label">Operation Type</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">{selectedOp ? formatCurrency(selectedOp.cost) : "$~"}</span>
                        <select className="form-select" id="operation-type" onChange={e => handleOpSelect(e.target.value)}>
                            {availableOps.map((op, index) => (
                                <option key={index} value={op.type}>{formatOperator(op.type)}</option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Calculator;