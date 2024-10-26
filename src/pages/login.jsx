const Login = () => {
    return (
        <div id="login-page">
            <div className="container my-3 p-3 border border-dark rounded">
                <form id="login-form">
                    <div className="mb-3">
                        <label htmlFor="input-username" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="input-username" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="input-password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="input-password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
