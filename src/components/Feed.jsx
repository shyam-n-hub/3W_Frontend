import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import PostCard from './PostCard';
import { postAPI } from '../api';

function Feed({ refresh, onRefreshComplete }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postAPI.getAllPosts();
            setPosts(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        } finally {
            setLoading(false);
            if (onRefreshComplete) onRefreshComplete();
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [refresh]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-3">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            {posts.length === 0 ? (
                <Alert variant="info">No posts yet. Be the first to post!</Alert>
            ) : (
                posts.map((post) => (
                    <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
                ))
            )}
        </Container>
    );
}

export default Feed;
