import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

const BrandBadge = () => (
    <span style={{
        background: '#00598E',
        color: '#fff',
        fontSize: '11px',
        padding: '2px 6px',
        borderRadius: '4px',
        marginLeft: '8px',
        fontWeight: 'normal',
        verticalAlign: 'middle'
    }}>✔ Brand Response</span>
);

const ModalOverlay = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
                {children}
            </div>
        </div>
    );
};

const FormTemplate = ({ title, type, formData, setFormData, submitResult, isSubmitting, handleFormSubmit }) => (
    <>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{title}</h3>
        {submitResult && (
            <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', background: submitResult.success ? '#e8f5e9' : '#ffebee', color: submitResult.success ? '#2e7d32' : '#c62828', border: `1px solid ${submitResult.success ? '#a5d6a7' : '#ef9a9a'}` }}>
                {submitResult.message}
            </div>
        )}
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Your name (e.g. John D.)" />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Your email (will not be published)" />
        </div>
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>{type === 'ask' ? 'Your Question' : 'Your Answer'}</label>
            <textarea rows="4" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder={type === 'ask' ? "What would you like to know about this product?" : "Write your helpful response..."}></textarea>
        </div>
        <button
            onClick={() => handleFormSubmit(type)}
            disabled={isSubmitting || !formData.name || !formData.email || !formData.text}
            style={{ background: '#0070bc', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: (isSubmitting || !formData.name || !formData.email || !formData.text) ? 'not-allowed' : 'pointer', fontWeight: 'bold', width: '100%', opacity: (isSubmitting || !formData.name || !formData.email || !formData.text) ? 0.6 : 1 }}
        >
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
    </>
);

const QASection = ({ familyData }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Most Answered');
    const [expandedQId, setExpandedQId] = useState(null);

    // Modal states
    const [showAskModal, setShowAskModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [activeQuestionId, setActiveQuestionId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({ name: '', email: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);
    const [votedAnswers, setVotedAnswers] = useState({});

    const familyId = familyData?.family?.id;

    const fetchQuestions = (sort = 'Most Answered') => {
        if (!familyId) return;
        setIsLoading(true);
        apiFetch({ path: `/paint-store/v1/public/product-families/${familyId}/questions?sort=${sort}` })
            .then(res => setQuestions(res))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchQuestions(sortBy);
    }, [familyId, sortBy]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const toggleAccordion = (id) => {
        setExpandedQId(expandedQId === id ? null : id);
    };

    const openAnswerModal = (qid) => {
        setActiveQuestionId(qid);
        setFormData({ name: '', email: '', text: '' });
        setSubmitResult(null);
        setShowAnswerModal(true);
    };

    const openAskModal = () => {
        setFormData({ name: '', email: '', text: '' });
        setSubmitResult(null);
        setShowAskModal(true);
    };

    const handleFormSubmit = (type) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        const path = type === 'ask'
            ? `/paint-store/v1/public/product-families/${familyId}/questions`
            : `/paint-store/v1/public/questions/${activeQuestionId}/answers`;

        apiFetch({
            path,
            method: 'POST',
            data: {
                author_name: formData.name,
                author_email: formData.email,
                text: formData.text
            }
        }).then(res => {
            if (res.success) {
                setSubmitResult({ success: true, message: type === 'ask' ? 'Question submitted successfully!' : 'Answer submitted successfully!' });
                setFormData({ name: '', email: '', text: '' });
                fetchQuestions(sortBy); // Refresh data
                setTimeout(() => {
                    setShowAskModal(false);
                    setShowAnswerModal(false);
                }, 2000);
            }
        }).catch(err => {
            setSubmitResult({ success: false, message: err.message || 'An error occurred. Please try again.' });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const handleVote = (answerId, type) => {
        if (votedAnswers[answerId]) return; // prevent double vote

        // Optimistically update UI
        setVotedAnswers(prev => ({ ...prev, [answerId]: type }));
        setQuestions(prev => prev.map(q => ({
            ...q,
            answers: q.answers.map(a => {
                if (a.id === answerId) {
                    return {
                        ...a,
                        helpful: {
                            ...a.helpful,
                            [type]: a.helpful[type] + 1
                        }
                    }
                }
                return a;
            })
        })));

        apiFetch({
            path: `/paint-store/v1/public/answers/${answerId}/vote`,
            method: 'POST',
            data: { type }
        }).catch(err => console.error('Vote failed', err));
    };

    if (!familyData || !familyId) return null;

    // Filter questions by search query
    const filteredQuestions = questions.filter(q => {
        const lowerQuery = searchQuery.toLowerCase();
        if (q.text.toLowerCase().includes(lowerQuery)) return true;
        // Search answers too
        if (q.answers.some(a => a.text.toLowerCase().includes(lowerQuery))) return true;
        return false;
    });



    return (
        <div id="qa-section" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', color: '#00598E', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Community Q & A <span style={{ color: '#0070bc', fontSize: '18px' }}>▲</span>
                </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder="Search Questions and Answers"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '12px 40px 12px 15px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                    />
                    <span style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '18px', color: '#666' }}>⌕</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <label style={{ position: 'absolute', top: '-10px', left: '10px', background: '#fcfcfc', padding: '0 5px', fontSize: '12px', color: '#666', zIndex: 1 }}>Sort By</label>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            style={{ padding: '12px 30px 12px 15px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '16px', background: 'transparent', appearance: 'none', cursor: 'pointer', zIndex: 0, minWidth: '180px' }}
                        >
                            <option value="Most Answered">Most Answered</option>
                            <option value="Newest">Newest</option>
                        </select>
                        <span style={{ position: 'absolute', right: '15px', pointerEvents: 'none', fontSize: '12px' }}>▼</span>
                    </div>

                    <button
                        onClick={openAskModal}
                        style={{ background: '#0070bc', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}
                    >
                        Ask a Question
                    </button>
                </div>
            </div>

            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>
                {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Question' : 'Questions'}
            </h3>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
                    No questions found. Be the first to ask!
                </div>
            ) : (
                <div className="qa-list">
                    {filteredQuestions.map((q) => {
                        const isExpanded = expandedQId === q.id;
                        return (
                            <div key={q.id} style={{ borderBottom: '1px solid #eaeaea', marginBottom: '15px', paddingBottom: '15px' }}>
                                {/* Accordion Header */}
                                <div
                                    onClick={() => toggleAccordion(q.id)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        cursor: 'pointer',
                                        padding: isExpanded ? '15px' : '15px 0',
                                        border: isExpanded ? '2px solid #0070bc' : 'none',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <span style={{ color: '#0070bc', fontSize: '16px', marginTop: '2px' }}>{isExpanded ? '▲' : '▼'}</span>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '18px', color: '#0070bc', fontWeight: 'bold', lineHeight: '1.4' }}>{q.text}</h4>
                                            <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                                                {q.author} on {q.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', lineHeight: '1' }}>{q.answers.length}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{q.answers.length === 1 ? 'Answer' : 'Answers'}</div>
                                    </div>
                                </div>

                                {/* Accordion Body */}
                                {isExpanded && (
                                    <div style={{ padding: '20px 20px 20px 45px', background: '#fff' }}>

                                        {q.answers.length > 0 ? (
                                            q.answers.map((ans, index) => (
                                                <div key={ans.id} style={{ marginBottom: index !== q.answers.length - 1 ? '30px' : '15px', borderLeft: '3px solid #eee', paddingLeft: '15px' }}>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#333', lineHeight: '1.5' }}>{ans.text}</p>
                                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                                                        By <span style={{ fontWeight: 'bold' }}>{ans.author}</span> {ans.isBrandResponse && <BrandBadge />} on {ans.date}
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#0070bc' }}>
                                                        <span style={{ color: '#555' }}>Was this Answer Helpful?</span>
                                                        <button
                                                            onClick={() => handleVote(ans.id, 'yes')}
                                                            disabled={votedAnswers[ans.id]}
                                                            style={{ background: 'none', border: 'none', color: '#0070bc', cursor: votedAnswers[ans.id] ? 'default' : 'pointer', padding: 0, opacity: votedAnswers[ans.id] === 'no' ? 0.5 : 1 }}
                                                        >
                                                            👍 ({ans.helpful.yes})
                                                        </button>
                                                        <span style={{ color: '#ccc' }}>|</span>
                                                        <button
                                                            onClick={() => handleVote(ans.id, 'no')}
                                                            disabled={votedAnswers[ans.id]}
                                                            style={{ background: 'none', border: 'none', color: '#0070bc', cursor: votedAnswers[ans.id] ? 'default' : 'pointer', padding: 0, opacity: votedAnswers[ans.id] === 'yes' ? 0.5 : 1 }}
                                                        >
                                                            👎 ({ans.helpful.no})
                                                        </button>
                                                        <span style={{ color: '#ccc' }}>|</span>
                                                        <button style={{ background: 'none', border: 'none', color: '#0070bc', cursor: 'pointer', padding: 0 }}>
                                                            ⚑ Report
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '15px 0', color: '#666', fontStyle: 'italic' }}>
                                                There are currently no answers to this question. Can you help?
                                            </div>
                                        )}

                                        <div style={{ marginTop: '20px' }}>
                                            <button
                                                onClick={() => openAnswerModal(q.id)}
                                                style={{ background: '#fff', color: '#0070bc', border: '1px solid #0070bc', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                                            >
                                                Answer This Question
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <ModalOverlay isVisible={showAskModal} onClose={() => !isSubmitting && setShowAskModal(false)}>
                <FormTemplate
                    title="Ask a New Question"
                    type="ask"
                    formData={formData}
                    setFormData={setFormData}
                    submitResult={submitResult}
                    isSubmitting={isSubmitting}
                    handleFormSubmit={handleFormSubmit}
                />
            </ModalOverlay>

            <ModalOverlay isVisible={showAnswerModal} onClose={() => !isSubmitting && setShowAnswerModal(false)}>
                <FormTemplate
                    title="Submit Your Answer"
                    type="answer"
                    formData={formData}
                    setFormData={setFormData}
                    submitResult={submitResult}
                    isSubmitting={isSubmitting}
                    handleFormSubmit={handleFormSubmit}
                />
            </ModalOverlay>

        </div>
    );
};

export default QASection;
