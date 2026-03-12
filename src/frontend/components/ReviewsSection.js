import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const StarRating = ({ rating, interactive = false, onRate = null }) => {
    return (
        <div style={{ display: 'flex', color: '#ffc107', fontSize: '18px', gap: '2px', cursor: interactive ? 'pointer' : 'default' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    onClick={() => interactive && onRate && onRate(star)}
                >
                    {star <= rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

const WriteReviewModal = ({ familyId, onClose, onSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [recommend, setRecommend] = useState(true);
    const [authorName, setAuthorName] = useState('');
    const [productInfo, setProductInfo] = useState('');
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new window.FormData();
        formData.append('rating', rating);
        formData.append('title', title);
        formData.append('text', text);
        formData.append('recommend', recommend ? 1 : 0);
        formData.append('author_name', authorName);
        formData.append('product_info', productInfo);
        images.forEach(file => {
            formData.append('images[]', file);
        });

        try {
            await apiFetch({
                path: `/paint-store/v1/public/product-families/${familyId}/reviews`,
                method: 'POST',
                body: formData
            });
            onSubmitted();
        } catch (err) {
            console.error('Error submitting review', err);
            setError('Failed to submit review. Please check all fields.');
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                <h2 style={{ margin: '0 0 20px 0' }}>Write a Review</h2>
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Overall Rating *</label>
                        <StarRating rating={rating} interactive={true} onRate={setRating} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Would you recommend this product?</label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <label><input type="radio" checked={recommend} onChange={() => setRecommend(true)} /> Yes</label>
                            <label><input type="radio" checked={!recommend} onChange={() => setRecommend(false)} /> No</label>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Review Title *</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Example: Great coverage!" />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Review *</label>
                        <textarea required value={text} onChange={(e) => setText(e.target.value)} rows={5} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Tell us about your experience..."></textarea>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nickname *</label>
                        <input type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Example: Bob R." />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Product Configurations Used</label>
                        <input type="text" value={productInfo} onChange={(e) => setProductInfo(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="e.g. 1 Gallon, Satin, White Base" />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Photos (Optional)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ marginBottom: '10px' }} />
                        {images.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {images.map((file, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={submitting} style={{ background: '#00598E', color: '#fff', border: 'none', padding: '12px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                        {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ReviewsSection = ({ familyId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [aggregate, setAggregate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchReviews = async () => {
        if (!familyId) return;
        setLoading(true);
        try {
            const result = await apiFetch({ path: `/paint-store/v1/public/product-families/${familyId}/reviews` });
            setReviews(result.reviews || []);
            setAggregate(result.aggregate || null);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [familyId]);

    if (!aggregate && !loading) return null;

    return (
        <div id="reviews" className="ps-overview-section" style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            boxSizing: 'border-box',
            background: '#fff',
            borderBottom: '1px solid #eee'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        borderBottom: isOpen ? '1px solid #eee' : 'none',
                        padding: '0 0 20px 0',
                        marginBottom: isOpen ? '30px' : '0',
                        cursor: 'pointer',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#111'
                    }}
                >
                    Reviews
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                        <path d="M6 9L12 15L18 9" stroke="#00598E" strokeWidth="2.5" strokeLinecap="square" />
                    </svg>
                </button>

                {isOpen && !loading && aggregate && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>

                        {/* LEFT COLUMN: Summary */}
                        <div style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '4px', textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <StarRating rating={Math.round(parseFloat(aggregate.average))} />
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#00598E' }}>{aggregate.average}</span>
                                </div>
                                <div style={{ fontSize: '18px', color: '#333' }}>out of 5</div>
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>{aggregate.total} Reviews</div>

                                <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '13px', color: '#00598E' }}>
                                    {[...aggregate.distribution].reverse().map(row => (
                                        <div key={row.stars} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '10px' }}>
                                            <div style={{ width: '40px' }}>{row.stars} Star</div>
                                            <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${row.percent}%`, height: '100%', background: '#ffc107' }}></div>
                                            </div>
                                            <div style={{ width: '30px', textAlign: 'right', color: '#666' }}>{row.percent}%</div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => setShowModal(true)} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#00598E', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                                    Write Review
                                </button>
                            </div>

                            <div style={{ background: '#e6f3f9', padding: '15px', borderRadius: '4px', textAlign: 'center', marginBottom: '20px' }}>
                                <span style={{ color: '#00598E', fontWeight: 'bold', fontSize: '16px' }}>{aggregate.recommend_percent}% Recommend this product</span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Reviews Content */}
                        <div style={{ flex: '2 1 600px' }}>
                            <h3 style={{ margin: '0 0 25px 0', fontSize: '18px' }}>{aggregate.total} Customer Reviews</h3>

                            {reviews.length === 0 ? (
                                <p style={{ color: '#666' }}>No reviews yet. Be the first to leave a review!</p>
                            ) : (
                                <div>
                                    {reviews.map(review => (
                                        <div key={review.id} style={{ borderTop: '1px solid #eee', paddingTop: '30px', paddingBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                            <div style={{ flex: '1 1 300px' }}>
                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{review.title}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                                    <StarRating rating={review.rating} />
                                                    <span style={{ fontSize: '14px', color: review.recommend ? '#2e7d32' : '#d32f2f', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        {review.recommend ? '✓ Would Recommend' : '✕ Would Not Recommend'}
                                                    </span>
                                                </div>
                                                <p style={{ margin: '0 0 20px 0', fontSize: '15px', lineHeight: '1.6', color: '#333' }}>{review.text}</p>

                                                {/* Attached Images */}
                                                {review.images && review.images.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                                                        {review.images.map((url, idx) => (
                                                            <img key={idx} src={url} alt={`Review image ${idx + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Brand Response */}
                                                {review.response && (
                                                    <div style={{ marginTop: '20px', background: '#f5f5f5', padding: '20px', borderRadius: '4px', position: 'relative' }}>
                                                        <h5 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Response from {review.response.author}</h5>
                                                        <p style={{ margin: '0 0 0 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>{review.response.text}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ flex: '0 0 200px', fontSize: '13px', color: '#666' }}>
                                                <div style={{ fontWeight: 'bold', color: '#111', fontSize: '14px', marginBottom: '5px' }}>{review.author}</div>
                                                <div style={{ marginBottom: '15px' }}>{review.date}</div>
                                                {review.productInfo && (
                                                    <div style={{ marginBottom: '15px' }}><span style={{ color: '#00598E' }}>From: {review.productInfo}</span></div>
                                                )}
                                                {review.verified && (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e1f5fe', color: '#00598E', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                                                        Verified Purchaser
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {showModal && (
                <WriteReviewModal
                    familyId={familyId}
                    onClose={() => setShowModal(false)}
                    onSubmitted={() => {
                        setShowModal(false);
                        fetchReviews();
                    }}
                />
            )}
        </div>
    );
};

export default ReviewsSection;
