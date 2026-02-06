import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar({ user }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <span className="icon-emoji">💬</span>
                    <span>SocialPost</span>
                </Link>
                <ul className="nav-links">
                    <li>
                        <Link
                            to="/"
                            className={`nav-linke ${location.pathname === '/' ? 'active' : ''}`}
                            data-tooltip="Home"
                        >
                            <span className="nav-icon">🏠</span>
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/feed"
                            className={`nav-linke ${location.pathname === '/feed' ? 'active' : ''}`}
                            data-tooltip="Feed"
                        >
                            <span className="nav-icon">📊</span>
                            <span>Feed</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/create"
                            className={`nav-linke ${location.pathname === '/create' ? 'active' : ''}`}
                            data-tooltip="Create"
                        >
                            <span className="nav-icon">➕</span>
                            <span>Create</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className={`nav-linke ${location.pathname === '/profile' ? 'active' : ''}`}
                            data-tooltip="Profile"
                        >
                            <span className="nav-icon">👤</span>
                            <span>Profile</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavigationBar;