const formatDateStr = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const formatHistoryOperands = (operands) => {
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

const formatOperator = (operator) => {
    // convert from snake_case to Title Case
    return operator.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export { formatDateStr, formatHistoryOperands, formatCurrency, formatOperator };