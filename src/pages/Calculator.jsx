import Header from "../components/Header";

const Calculator = () => {
    return (
        <div className="calculator">
            <Header updateBalance={false} setUpdateBalance={() => {}} />
            <div id="run-calculation" className="container my-3">
                Hello, world!
            </div>
        </div>
    );
};

export default Calculator;