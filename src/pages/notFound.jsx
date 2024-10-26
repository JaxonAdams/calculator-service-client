import { useRouteError } from "react-router-dom";

const NotFound = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <div className="container p-4 h-100 d-flex align-items-center justify-content-center text-center">
                <div>
                    <h1> 404 Not Found</h1>
                    <p>Sorry, we're not sure what you're looking for.</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
