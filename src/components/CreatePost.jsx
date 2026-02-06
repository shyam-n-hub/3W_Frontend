import { useState } from 'react';
import { postAPI } from '../api';

function CreatePost({ onPostCreated }) {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        if (!text && !image) {
            setError('Please add text or image');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            if (text) formData.append('text', text);
            if (image) formData.append('image', image);

            await postAPI.createPost(formData);

            setText('');
            setImage(null);
            setPreview(null);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            onPostCreated();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-3d">
            <div className="p-4">
                {error && (
                    <div className="alert alert-danger mb-3" style={{ padding: '1rem', background: '#ffe0e6', border: '2px solid #ff6b9d', borderRadius: '12px', color: '#d63031' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success mb-3" style={{ padding: '1rem', background: '#d5f4e6', border: '2px solid #2ed573', borderRadius: '12px', color: '#00b894' }}>
                        Post created successfully! 🎉
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ resize: 'none' }}
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
                                className="btn btn-danger"
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

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <label className="btn btn-outline">
                                <i className="bi bi-image"></i>
                                {image ? 'Change Image' : 'Add Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px' }}></span>
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send-fill"></i>
                                    Post
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
