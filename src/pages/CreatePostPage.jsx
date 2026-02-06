import { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import CreatePost from '../components/CreatePost';
import { useNavigate } from 'react-router-dom';

function CreatePostPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handlePostCreated = () => {
        navigate('/feed');
    };

    return (
        <>
            <NavigationBar user={user} />
            <div className="container" style={{ marginTop: '2rem', maxWidth: '700px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                        <i className="bi bi-plus-circle-fill" style={{ marginRight: '0.5rem', color: 'var(--dark-green)' }}></i>
                        Create Post
                    </h2>
                    <p className="text-muted">Share your thoughts with the world</p>
                </div>
                <CreatePost onPostCreated={handlePostCreated} />
            </div>
        </>
    );
}

export default CreatePostPage;
