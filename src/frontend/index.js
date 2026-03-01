import { render } from '@wordpress/element';
import App from './App';
import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('paint-store-builder-root');
    if (rootElement) {
        // Parse attributes passed from the PHP shortcode
        const familyId = rootElement.getAttribute('data-family-id');

        render(<App familyId={familyId} />, rootElement);
    }
});
