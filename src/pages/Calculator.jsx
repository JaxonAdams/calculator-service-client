import { useEffect, useState } from "react";

import Header from "../components/Header";

import { formatOperator, formatCurrency } from "../utils/format_util";
import CalculatorAPIService from "../services/CalculatorAPIService";

const Calculator = () => {
    const [availableOps, setAvailableOps] = useState([]);
    const [selectedOp, setSelectedOp] = useState(null);
    const [additionalOperands, setAdditionalOperands] = useState([]);
    const [operandValues, setOperandValues] = useState([]);

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

        if (userSelectedOp.options.operand_count !== "variable") {
            setAdditionalOperands([]);  // reset additional operands

            if (userSelectedOp.options.operand_type === "number") {
                setOperandValues([operandValues[0]]);
            } else {
                setOperandValues([]);
            }
        }

        console.log("Operation options: ", userSelectedOp.options);
    };

    const handleOperandChange = (e) => {
        const index = parseInt(e.target.id.split("-")[1]) - 1;
        const value = e.target.value;

        const newValues = [...operandValues];
        newValues[index] = value;
        setOperandValues(newValues);
    };

    const handleSettingsChange = (e) => {
        const key = e.target.id.split("-")[2];
        let value = e.target.value;
        
        // if first operand value is an object, we need to update the object
        if (selectedOp.options.operand_type === "dictionary") {
            const newSettings = operandValues[0] || {};

            if (selectedOp.options.options[key].type === "int") {
                value = parseInt(value);
            } else if (selectedOp.options.options[key].type === "bool") {
                value = value === "true";
            }

            newSettings[key] = value;
            setOperandValues([newSettings]);
        }
    };

    const configureFirstOperand = () => {
        if (!selectedOp) {
            return;
        }

        if (selectedOp.options.operand_type === "number") {
            return (
                <div className="input-group mb-3">
                    <label htmlFor="operand-1" className="input-group-text">Operand 1</label>
                    <input type="number" className="form-control" id="operand-1" onChange={handleOperandChange} />
                    {selectedOp.options.operand_count === "variable" && (
                        <button className="btn btn-outline-secondary" type="button" onClick={addOperand}>Add Operand</button>
                    )}
                </div>
            );
        }

        if (selectedOp.options.operand_type === "dictionary") {
            const settingsInputs = [];
            for (let optionKey in selectedOp.options.options) {
                let optionInfo = selectedOp.options.options[optionKey];
                
                let inputElement;
                if (optionInfo.type === "number" || optionInfo.type === "int") {
                    inputElement = <input type="number" className="form-control" id={`operand-1-${optionKey}`} onChange={handleSettingsChange} />;
                } else if (optionInfo.type === "bool") {
                    inputElement = (
                        <select className="form-select" id={`operand-1-${optionKey}`} onChange={handleSettingsChange} defaultValue={"true"}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    );
                }

                settingsInputs.push(
                    <div className="input-group mb-3" key={optionKey}>
                        <label htmlFor={`operand-1-${optionKey}`} className="input-group-text">{formatOperator(optionKey)}</label>
                        {inputElement}
                    </div>
                );
            }
            return settingsInputs;
        }
    };

    const addOperand = () => {
        setAdditionalOperands([
            ...additionalOperands, 
            <div className="input-group mb-3">
                <label htmlFor={`operand-${operandValues.length + 1}`} className="input-group-text">Operand {additionalOperands.length + 2}</label>
                <input type="number" className="form-control" id={`operand-${operandValues.length + 1}`} onChange={handleOperandChange} />
            </div>
        ]);
    };

    return (
        <div className="calculator">
            <Header updateBalance={false} setUpdateBalance={() => {}} />
            <div id="run-calculation" className="container my-3 p-3 border border-dark rounded">
                <h2 className="p-3 mb-5 border-bottom border-3">Run a Calculation</h2>
                <form className="calculation-form">
                    
                    <div className="mb-3">
                        <label htmlFor="operation-type" className="form-label">Operation Type</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">{selectedOp ? formatCurrency(selectedOp.cost) : "$~"}</span>
                            <select className="form-select" id="operation-type" onChange={e => handleOpSelect(e.target.value)}>
                                {availableOps.map((op, index) => (
                                    <option key={index} value={op.type}>{formatOperator(op.type)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-text">{selectedOp && selectedOp.options.description}</div>
                    </div>

                    <div className="mb-3">
                        {configureFirstOperand()}
                        {additionalOperands.map((operand, index) => (
                            <div key={index}>
                                {operand}
                            </div>
                        ))}
                    </div>
                </form>
                <div>TESTING... {operandValues && selectedOp && selectedOp.options.operand_type === "dictionary" ? JSON.stringify(operandValues[0]) : operandValues.join(", ")}</div>
            </div>
        </div>
    );
};

export default Calculator;