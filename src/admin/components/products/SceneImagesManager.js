import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';

const SceneImagesManager = ({ sceneImages, fetchSceneImages }) => {
    const [name, setName] = useState('');
    const [imageId, setImageId] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const openMediaUploader = () => {
        const frame = wp.media({
            title: 'Select Scene Image (transparent PNG)',
            button: { text: 'Use this image' },
            multiple: false,
            library: { type: 'image' },
        });
        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            setImageId(attachment.id);
            setImageUrl(attachment.sizes?.medium?.url || attachment.url);
        });
        frame.open();
    };

    const removeImage = () => {
        setImageId(0);
        setImageUrl('');
    };

    const handleSave = async () => {
        if (!name || !imageId) { alert('Name and Image are required.'); return; }
        setIsSaving(true);
        try {
            const data = { name, image_id: imageId };
            if (editingId) {
                await apiFetch({ path: `/paint-store/v1/scene-images/${editingId}`, method: 'PUT', data });
            } else {
                await apiFetch({ path: '/paint-store/v1/scene-images', method: 'POST', data });
            }
            setName(''); setImageId(0); setImageUrl(''); setEditingId(null);
            fetchSceneImages();
        } catch (error) {
            console.error('Error saving scene image:', error);
            alert('Error saving scene image: ' + (error.message || JSON.stringify(error)));
        }
        setIsSaving(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setImageId(item.image_id ? parseInt(item.image_id) : 0);
        setImageUrl(item.image_url || '');
    };
    const handleCancelEdit = () => {
        setEditingId(null); setName(''); setImageId(0); setImageUrl('');
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this scene image?')) return;
        try {
            await apiFetch({ path: `/paint-store/v1/scene-images/${id}`, method: 'DELETE' });
            if (editingId === id) handleCancelEdit();
            fetchSceneImages();
        } catch (error) { alert('Error deleting scene image: ' + (error.message || JSON.stringify(error))); }
    };

    return (
        <div className="scene-images-manager">
            <PanelBody title={editingId ? "Edit Scene Image" : "Add New Scene Image"} initialOpen={true}>
                <PanelRow>
                    <TextControl
                        label="Scene Name (e.g., Modern Living Room, Cozy Bedroom)"
                        value={name}
                        onChange={setName}
                        style={{ width: '100%' }}
                    />
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                            Scene Image (transparent PNG with walls removed)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            {imageUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        background: 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 16px 16px',
                                        borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden',
                                    }}>
                                        <img
                                            src={imageUrl}
                                            alt={name || 'Scene preview'}
                                            style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <Button
                                        isSmall isDestructive onClick={removeImage}
                                        style={{ position: 'absolute', top: '-8px', right: '-8px', borderRadius: '50%', minWidth: '24px', height: '24px', padding: 0 }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={openMediaUploader}
                                    style={{
                                        width: '300px', height: '200px', border: '2px dashed #ccc', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px',
                                        transition: 'border-color 0.2s',
                                        background: 'repeating-conic-gradient(#f5f5f5 0% 25%, #fff 0% 50%) 50% / 16px 16px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0073aa'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ccc'}
                                >
                                    <span>🖼️<br />Click to upload scene image<br /><small>(transparent PNG)</small></span>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button variant="secondary" onClick={openMediaUploader}>
                                    {imageUrl ? 'Change Image' : 'Upload Image'}
                                </Button>
                                {imageUrl && (
                                    <Button variant="tertiary" isDestructive onClick={removeImage}>Remove Image</Button>
                                )}
                            </div>
                        </div>
                        <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                            Upload a PNG image of a room with the wall areas made transparent.
                            On the frontend, the selected paint color will show through the transparent wall areas.
                        </p>
                    </div>
                </PanelRow>
                <div style={{ padding: '10px 20px 20px', display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={handleSave} isBusy={isSaving} disabled={!name || !imageId || isSaving}>
                        {editingId ? 'Update Scene' : 'Add Scene'}
                    </Button>
                    {editingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                </div>
            </PanelBody>

            <div style={{ marginTop: '30px' }}>
                <h3>Existing Scene Images</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                    These scenes are available for the Color Visualizer — customers can preview any color on these room scenes.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {sceneImages.length === 0 ? (
                        <p style={{ color: '#999' }}>No scene images yet. Upload your first room scene above.</p>
                    ) : sceneImages.map(item => (
                        <div key={item.id} style={{
                            border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',
                            background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}>
                            <div style={{
                                height: '180px',
                                background: 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 16px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <span style={{ color: '#999' }}>No image</span>
                                )}
                            </div>
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #eee' }}>
                                <strong style={{ fontSize: '14px' }}>{item.name}</strong>
                                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                                    <Button isSmall variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button isSmall isDestructive onClick={() => handleDelete(item.id)}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SceneImagesManager;
