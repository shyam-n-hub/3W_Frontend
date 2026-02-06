import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/Home';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            isAuthenticated ? <Navigate to="/" /> : <Signup setIsAuthenticated={setIsAuthenticated} />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <HomePage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/feed"
                        element={
                            isAuthenticated ? <FeedPage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/create"
                        element={
                            isAuthenticated ? <CreatePostPage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            isAuthenticated ? <ProfilePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
