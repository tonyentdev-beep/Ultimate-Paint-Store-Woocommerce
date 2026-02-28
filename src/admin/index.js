import { render } from '@wordpress/element';
import App from './components/App';

import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('paint-store-admin-root');
    if (rootElement) {
        render(<App />, rootElement);
    }
});
