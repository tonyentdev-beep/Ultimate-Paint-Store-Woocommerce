import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const ReviewsManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseForm, setResponseForm] = useState(null); // { id, text }
    const [saving, setSaving] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch({ path: '/paint-store/v1/admin/reviews' });
            setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            await apiFetch({
                path: `/paint-store/v1/admin/reviews/${id}`,
                method: 'DELETE'
            });
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Failed to delete review.');
        }
    };

    const handleSaveResponse = async (id) => {
        if (!responseForm || !responseForm.text) return;
        setSaving(true);

        try {
            await apiFetch({
                path: `/paint-store/v1/admin/reviews/${id}`,
                method: 'PUT',
                data: {
                    response_text: responseForm.text,
                    response_author: 'Customer Service' // Could be made dynamic later
                }
            });
            setResponseForm(null);
            fetchReviews(); // Refresh to show new date/author
        } catch (err) {
            console.error('Error saving response:', err);
            alert('Failed to save response.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Customer Reviews</h2>
                <button onClick={fetchReviews} className="button">Refresh</button>
            </div>

            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <table className="wp-list-table widefat fixed striped table-view-list">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th style={{ width: '15%' }}>Product Family</th>
                            <th style={{ width: '10%' }}>Rating</th>
                            <th style={{ width: '30%' }}>Review</th>
                            <th style={{ width: '15%' }}>Author / Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id}>
                                <td>{review.id}</td>
                                <td>
                                    <strong>{review.family_name || `Family #${review.family_id}`}</strong>
                                    {review.recommend && <div style={{ color: '#2e7d32', fontSize: '12px', marginTop: '5px' }}>✓ Recommends</div>}
                                </td>
                                <td>
                                    <div style={{ color: '#ffc107', fontSize: '16px' }}>
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </td>
                                <td>
                                    <strong>{review.title}</strong>
                                    <p style={{ margin: '5px 0', fontSize: '13px' }}>{review.text}</p>

                                    {/* Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                            {review.images.map((url, idx) => (
                                                <a href={url} target="_blank" rel="noopener noreferrer" key={idx}>
                                                    <img src={url} alt="User attachment" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Brand Response rendering / editor */}
                                    <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #00598E' }}>
                                        {responseForm && responseForm.id === review.id ? (
                                            <div>
                                                <textarea
                                                    value={responseForm.text}
                                                    onChange={(e) => setResponseForm({ ...responseForm, text: e.target.value })}
                                                    style={{ width: '100%', marginBottom: '5px' }}
                                                    rows={3}
                                                    placeholder="Type official brand response here..."
                                                ></textarea>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <button
                                                        className="button button-primary button-small"
                                                        onClick={() => handleSaveResponse(review.id)}
                                                        disabled={saving}
                                                    >
                                                        {saving ? 'Saving...' : 'Save Response'}
                                                    </button>
                                                    <button className="button button-small" onClick={() => setResponseForm(null)} disabled={saving}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {review.response ? (
                                                    <div>
                                                        <strong style={{ fontSize: '12px', color: '#555' }}>Brand Response ({review.response.date}):</strong>
                                                        <p style={{ margin: '5px 0', fontSize: '13px' }}>{review.response.text}</p>
                                                        <button className="button-link" style={{ fontSize: '12px' }} onClick={() => setResponseForm({ id: review.id, text: review.response.text })}>Edit Response</button>
                                                    </div>
                                                ) : (
                                                    <button className="button button-small" onClick={() => setResponseForm({ id: review.id, text: '' })}>Add Brand Response</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <strong>{review.author}</strong><br />
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="button button-link-delete"
                                        style={{ color: '#d63638', textDecoration: 'none' }}
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReviewsManager;
