import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import NavigationBar from '../components/NavigationBar';
import { postAPI } from '../api';

function HomePage() {
    const [stats, setStats] = useState({ totalPosts: 0, totalUsers: 0, totalLikes: 0 });
    const [recentPosts, setRecentPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await postAPI.getAllPosts();
            const allPosts = response.data;
            const myPosts = allPosts.filter(p => p.username === user.name);
            const totalLikes = allPosts.reduce((sum, post) => sum + post.likes.length, 0);

            setStats({
                totalPosts: allPosts.length,
                totalUsers: new Set(allPosts.map(p => p.username)).size,
                totalLikes: totalLikes
            });
            setRecentPosts(allPosts.slice(0, 3));
            setUserPosts(myPosts.slice(0, 8));
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    return (
        <>
            <NavigationBar user={user} />
            <div className="container home-container">
                <div className="home-grid">
                    {/* Left Column */}
                    <div className="home-left-column">
                        {/* Dashboard Overview */}
                        <div className="dashboard-overview">
                            <h3 className="dashboard-title">Dashboard Overview</h3>
                            <div className="stats-grid">
                                <div className="stat-card stat-red">
                                    <div className="stat-card-header">
                                        <i className="bi bi-file-post-fill stat-icon"></i>
                                    </div>
                                    <div className="stat-value">{stats.totalPosts}</div>
                                    <div className="stat-label">Total Posts</div>
                                </div>
                                <div className="stat-card stat-dark">
                                    <div className="stat-card-header">
                                        <i className="bi bi-heart-fill stat-icon"></i>
                                    </div>
                                    <div className="stat-value">{stats.totalLikes}</div>
                                    <div className="stat-label">Total Likes</div>
                                </div>
                                <div className="stat-card stat-gray">
                                    <div className="stat-card-header">
                                        <i className="bi bi-people-fill stat-icon"></i>
                                    </div>
                                    <div className="stat-value">{stats.totalUsers}</div>
                                    <div className="stat-label">Active Users</div>
                                </div>
                            </div>
                        </div>

                        {/* My Profile Section */}
                        <div className="profile-section">
                            <div className="profile-header-section">
                                <div className="profile-info">
                                    <div className="profile-avatar-small">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="profile-name-section">
                                        <h4>My Profile</h4>
                                        <div className="profile-stats-inline">
                                            <div className="profile-stat-inline">
                                                <div className="profile-stat-inline-value">{userPosts.length}</div>
                                                <div className="profile-stat-inline-label">Posts</div>
                                            </div>
                                            <div className="profile-stat-inline">
                                                <div className="profile-stat-inline-value">
                                                    {userPosts.reduce((sum, p) => sum + p.likes.length, 0)}
                                                </div>
                                                <div className="profile-stat-inline-label">Likes</div>
                                            </div>
                                            <div className="profile-stat-inline">
                                                <div className="profile-stat-inline-value">{stats.totalUsers}</div>
                                                <div className="profile-stat-inline-label">Following</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-link" onClick={() => navigate('/profile')}>
                                    <i className="bi bi-three-dots"></i>
                                </button>
                            </div>

                            {/* Profile Images Grid */}
                            <div className="profile-images-grid">
                                {userPosts.slice(0, 8).map((post, index) => (
                                    <div key={index} className="profile-image-item" onClick={() => navigate('/profile')}>
                                        {post.image ? (
                                            <img src={`http://localhost:5000${post.image}`} alt="Post" />
                                        ) : (
                                            <div className="profile-image-placeholder">
                                                {post.text?.substring(0, 20)}...
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {userPosts.length === 0 && (
                                    <div className="empty-state">
                                        <i className="bi bi-images"></i>
                                        <p>No posts yet</p>
                                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/create')}>
                                            Create Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - All Posts */}
                    <div className="home-right-column">
                        <div className="posts-feed-section">
                            <div className="posts-feed-header">
                                <h3 className="posts-feed-title">All Posts</h3>
                                <div className="posts-navigation">
                                    <button className="nav-arrow">
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button className="nav-arrow">
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>

                            {recentPosts.length > 0 ? (
                                recentPosts.map((post) => (
                                    <div key={post._id} className="large-post-card">
                                        {post.image && (
                                            <img
                                                src={`http://localhost:5000${post.image}`}
                                                alt="Post"
                                                className="large-post-image"
                                            />
                                        )}
                                        <div className="large-post-info">
                                            <h4 className="large-post-title">
                                                {post.text ? post.text.substring(0, 50) : 'Untitled Post'}
                                                {post.text && post.text.length > 50 && '...'}
                                            </h4>
                                            <div className="large-post-author">
                                                <div className="large-post-author-avatar">
                                                    {post.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="large-post-author-name">{post.username}</span>
                                            </div>
                                            <div className="large-post-stats">
                                                <span>
                                                    <i className="bi bi-heart-fill"></i>
                                                    {post.likes.length} Likes
                                                </span>
                                                <span>
                                                    <i className="bi bi-chat-fill"></i>
                                                    {post.comments.length} Comments
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <i className="bi bi-inbox"></i>
                                    <p>No posts yet. Be the first to share!</p>
                                    <button className="btn btn-primary" onClick={() => navigate('/create')}>
                                        Create Post
                                    </button>
                                </div>
                            )}

                            <div className="view-all-container">
                                <button className="btn btn-secondary" onClick={() => navigate('/feed')}>
                                    <i className="bi bi-grid-3x3-gap"></i>
                                    View All Posts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
