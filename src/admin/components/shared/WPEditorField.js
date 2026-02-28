import { useRef, useEffect } from '@wordpress/element';

/**
 * A React wrapper around WordPress's built-in TinyMCE editor (wp.oldEditor).
 * Renders a full visual/text editor for rich HTML content.
 */
const WPEditorField = ({ id, label, value, onChange }) => {
    const editorId = id || 'wp-editor-' + Math.random().toString(36).substr(2, 9);
    const containerRef = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        // Wait a tick for the DOM to settle, then initialize
        const timer = setTimeout(() => {
            if (window.wp && window.wp.oldEditor && !initialized.current) {
                window.wp.oldEditor.initialize(editorId, {
                    tinymce: {
                        wpautop: true,
                        plugins: 'charmap colorpicker hr lists paste tabfocus textcolor wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
                        toolbar1: 'formatselect | bold italic underline strikethrough | bullist numlist | blockquote | alignleft aligncenter alignright | link unlink | forecolor | removeformat',
                        toolbar2: '',
                        height: 200,
                        setup: (editor) => {
                            editor.on('change keyup', () => {
                                onChange(editor.getContent());
                            });
                        },
                    },
                    quicktags: true,
                    mediaButtons: false,
                });
                initialized.current = true;
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (initialized.current && window.wp && window.wp.oldEditor) {
                window.wp.oldEditor.remove(editorId);
                initialized.current = false;
            }
        };
    }, []);

    // Sync external value changes (e.g., when editing or clearing the form)
    useEffect(() => {
        if (initialized.current && window.tinymce) {
            const editor = window.tinymce.get(editorId);
            if (editor && editor.getContent() !== value) {
                editor.setContent(value || '');
            }
        }
        // Also sync the underlying textarea for quicktags (text) mode
        const textarea = document.getElementById(editorId);
        if (textarea && textarea.value !== value) {
            textarea.value = value || '';
        }
    }, [value]);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            {label && <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>{label}</label>}
            <textarea
                id={editorId}
                defaultValue={value}
                style={{ width: '100%', minHeight: '200px' }}
            />
        </div>
    );
};

export default WPEditorField;
