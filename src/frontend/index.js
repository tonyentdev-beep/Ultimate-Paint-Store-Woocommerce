import { render } from '@wordpress/element';
import App from './App';
import ColorPage from './components/ColorPage';
import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('paint-store-builder-root');
    if (rootElement) {
        const familyId = rootElement.getAttribute('data-family-id');
        const colorSlug = window.paintStoreSettings && window.paintStoreSettings.colorSlug;
        const isGlobalColorsPage = window.paintStoreSettings && window.paintStoreSettings.isGlobalColorsPage;

        if (isGlobalColorsPage) {
            import('./components/GlobalColorBrowser').then(({ default: GlobalColorBrowser }) => {
                render(<GlobalColorBrowser />, rootElement);
            });
        } else if (colorSlug) {
            render(<ColorPage colorSlug={colorSlug} />, rootElement);
        } else {
            render(<App familyId={familyId} />, rootElement);
        }
    }
});
