import { useState } from 'react';
import './PostCard.css';
import { postAPI } from '../api';

function PostCard({ post, onUpdate, showActions = true }) {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isLiked = post.likes.some(like => like.username === currentUser.name);
    const isOwner = post.username === currentUser.name;

    const handleLike = async () => {
        try {
            await postAPI.likePost(post._id);
            onUpdate();
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await postAPI.commentPost(post._id, { text: commentText });
            setCommentText('');
            onUpdate();
        } catch (err) {
            console.error('Failed to comment', err);
        }
    };

    return (
        <div className="post-card fade-in">
            {/* Post Header */}
            <div className="post-header">
                <div className="post-avatar">
                    {post.username.charAt(0).toUpperCase()}
                </div>
                <div className="post-user-info">
                    <div className="post-username">{post.username}</div>
                    <div className="post-time">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
            </div>

            {/* Post Content */}
            {post.text && (
                <div className="post-content">
                    <p className="post-text">{post.text}</p>
                </div>
            )}

            {/* Post Image */}
            {post.image && (
                <div>
                    <img
                        src={`http://localhost:5000${post.image}`}
                        alt="Post"
                        className="post-image"
                    />
                </div>
            )}

            {/* Like and Comment Counts */}
            <div className="post-stats">
                <span className="post-stat">
                    {post.likes.length > 0 && (
                        <>
                            <i className="bi bi-heart-fill" style={{ color: '#ff6b9d' }}></i>
                            {' '}{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                        </>
                    )}
                </span>
                <span className="post-stat">
                    {post.comments.length > 0 && `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
                </span>
            </div>

            {/* Action Buttons */}
            {showActions && (
                <div className="post-actions">
                    <button
                        className={`action-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        Like
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <i className="bi bi-chat"></i>
                        Comment
                    </button>
                </div>
            )}

            {/* Comments Section */}
            {showComments && (
                <div className="comments-section">
                    {/* Comment Input */}
                    <form onSubmit={handleComment}>
                        <div className="comment-input-wrapper">
                            <div className="comment-avatar">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <input
                                type="text"
                                className="comment-input"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    {post.comments.length > 0 && (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {post.comments.map((comment, index) => (
                                <div key={index} className="comment-item">
                                    <div className="comment-avatar">
                                        {comment.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-author">{comment.username}</div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostCard;
