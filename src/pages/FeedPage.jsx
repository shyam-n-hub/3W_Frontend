import { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import PostCard from '../components/PostCard';
import { postAPI } from '../api';

function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postAPI.getAllPosts();
            setPosts(response.data);
        } catch (err) {
            console.error('Failed to load posts', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavigationBar user={user} />
            <div className="container" style={{ marginTop: '2rem', maxWidth: '700px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                        <i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: '0.5rem', color: 'var(--dark-green)' }}></i>
                        Feed
                    </h2>
                    <p className="text-muted">See what everyone is sharing</p>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '3rem 0' }}>
                        <div className="spinner"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="card text-center p-4">
                        <i className="bi bi-inbox" style={{ fontSize: '5rem', color: 'var(--dark-gray)', marginBottom: '1rem' }}></i>
                        <h5 className="text-muted">No posts yet</h5>
                        <p className="text-muted">Be the first to share something!</p>
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default FeedPage;
