import iconSvg from "../assets/icon.svg";

const Header = () => {
    return (
        <nav className="navbar bg-light">
            <div className="container-fluid">
                <a className="navbar-brand mb-0 h1" href="/">
                    <img
                        src={iconSvg}
                        alt="Premium Calculator"
                        width="30"
                        height="24"
                        className="d-inline-block align-text-bottom"
                    />
                    Premium Calculator
                </a>
            </div>
        </nav>
    );
};

export default Header;
