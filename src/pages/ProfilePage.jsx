import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import NavigationBar from '../components/NavigationBar';
import EditPostModal from '../components/EditPostModal';
import { postAPI } from '../api';

function ProfilePage({ setIsAuthenticated }) {
    const [userPosts, setUserPosts] = useState([]);
    const [stats, setStats] = useState({ posts: 0, likes: 0, comments: 0 });
    const [editingPost, setEditingPost] = useState(null);
    const [deletingPost, setDeletingPost] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const fetchUserPosts = async () => {
        try {
            const response = await postAPI.getAllPosts();
            const myPosts = response.data.filter(post => post.username === user.name);
            setUserPosts(myPosts);

            const totalLikes = myPosts.reduce((sum, post) => sum + post.likes.length, 0);
            const totalComments = myPosts.reduce((sum, post) => sum + post.comments.length, 0);

            setStats({
                posts: myPosts.length,
                likes: totalLikes,
                comments: totalComments
            });
        } catch (err) {
            console.error('Failed to load user posts', err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await postAPI.deletePost(postId);
            fetchUserPosts();
        } catch (err) {
            console.error('Failed to delete post', err);
            alert(err.response?.data?.message || 'Failed to delete post');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <>
            <NavigationBar user={user} />
            <div className="container" style={{ marginTop: '2rem' }}>
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="profile-name">{user?.name}</h2>
                    <p className="profile-email">{user?.email}</p>
                    <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: '1rem' }}>
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                    </button>
                </div>

                {/* Profile Stats */}
                <div className="profile-stats">
                    <div className="profile-stat">
                        <div className="profile-stat-value">{stats.posts}</div>
                        <div className="profile-stat-label">Posts</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">{stats.likes}</div>
                        <div className="profile-stat-label">Likes</div>
                    </div>
                    <div className="profile-stat">
                        <div className="profile-stat-value">{stats.comments}</div>
                        <div className="profile-stat-label">Comments</div>
                    </div>
                </div>

                {/* My Posts */}
                <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>
                        <i className="bi bi-grid-3x3" style={{ marginRight: '0.5rem', color: 'var(--dark-green)' }}></i>
                        My Posts
                    </h4>
                    {userPosts.length === 0 ? (
                        <div className="card text-center p-4">
                            <i className="bi bi-inbox" style={{ fontSize: '5rem', color: 'var(--dark-gray)', marginBottom: '1rem' }}></i>
                            <h5 className="text-muted" style={{ marginBottom: '1rem' }}>No posts yet</h5>
                            <button className="btn btn-primary" onClick={() => navigate('/create')}>
                                Create Your First Post
                            </button>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {userPosts.map((post) => (
                                <div key={post._id} className="grid-post-card">
                                    {post.image && (
                                        <img
                                            src={`http://localhost:5000${post.image}`}
                                            alt="Post"
                                            className="grid-post-image"
                                        />
                                    )}
                                    <div className="grid-post-content">
                                        {post.text && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                {post.text.substring(0, 80)}
                                                {post.text.length > 80 && '...'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid-post-stats">
                                        <span>
                                            <i className="bi bi-heart-fill" style={{ color: '#ff6b9d' }}></i>
                                            {' '}{post.likes.length}
                                        </span>
                                        <span>
                                            <i className="bi bi-chat-fill" style={{ color: '#74b9ff' }}></i>
                                            {' '}{post.comments.length}
                                        </span>
                                    </div>
                                    <div className="grid-post-actions">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => setEditingPost(post)}
                                        >
                                            <i className="bi bi-pencil-fill"></i>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeletePost(post._id)}
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Post Modal */}
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => setEditingPost(null)}
                    onUpdate={() => {
                        fetchUserPosts();
                        setEditingPost(null);
                    }}
                />
            )}
        </>
    );
}

export default ProfilePage;
