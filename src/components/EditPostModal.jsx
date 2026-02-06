import { useState } from 'react';
import { postAPI } from '../api';

function EditPostModal({ post, onClose, onUpdate }) {
    const [text, setText] = useState(post.text || '');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(post.image ? `http://localhost:5000${post.image}` : null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!text && !preview) {
            setError('Post must contain text or image');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            if (text) formData.append('text', text);
            if (image) formData.append('image', image);

            await postAPI.updatePost(post._id, formData);
            onUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Edit Post</h3>
                    <button className="modal-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Text</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {preview && (
                        <div className="mb-3" style={{ position: 'relative' }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                                onClick={() => {
                                    setImage(null);
                                    setPreview(null);
                                }}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="btn btn-outline">
                            <i className="bi bi-image"></i>
                            {image ? 'Change Image' : preview ? 'Replace Image' : 'Add Image'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px' }}></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg"></i>
                                    Update Post
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPostModal;
