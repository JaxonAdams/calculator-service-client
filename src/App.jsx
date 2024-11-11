import Header from "./components/Header";
import "./App.css";

function App() {
    return (
        <div className="app">
            <Header updateBalance={false} setUpdateBalance={() => {}} />
            <div className="container my-3">
                <div className="container p-3 my-5 border-bottom border-3">
                    <h1 className="text-center">Premium Calculator</h1>
                    <p className="lead text-center mb-3">The pay-as-you-go calculator you didn't know you needed!</p>
                </div>
                <figure className="text-center p-3 mb-3">
                    <blockquote className="blockquote">
                        <p>"If you're good at something, never do it for free."</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        "Joker", <cite title="The Dark Knight">The Dark Knight, 2008</cite>
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}

export default App;