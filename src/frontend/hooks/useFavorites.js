import { useState, useEffect } from '@wordpress/element';

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    // Load initial state and listen for changes
    useEffect(() => {
        const loadFavorites = () => {
            const storedFavorites = localStorage.getItem('paintStoreFavorites');
            if (storedFavorites) {
                try {
                    // Ensure all IDs are numbers
                    const parsed = JSON.parse(storedFavorites);
                    setFavorites(parsed.map(id => parseInt(id, 10)));
                } catch (e) {
                    console.error("Failed to parse favorites from local storage", e);
                }
            }
        };

        // Load initially
        loadFavorites();

        // Listen for cross-tab changes
        const handleStorageChange = (e) => {
            if (e.key === 'paintStoreFavorites') {
                loadFavorites();
            }
        };
        
        // Listen for same-tab cross-component changes
        const handleCustomEvent = () => loadFavorites();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favoritesChanged', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesChanged', handleCustomEvent);
        };
    }, []);

    const toggleFavorite = (rawColorId, e) => {
        // Prevent navigating if the heart is inside a link wrapper
        if (e && e.preventDefault) e.preventDefault();
        
        const colorId = parseInt(rawColorId, 10);
        
        // Calculate new favorites list
        const storedFavorites = localStorage.getItem('paintStoreFavorites');
        let currentFavorites = [];
        if (storedFavorites) {
            try {
                currentFavorites = JSON.parse(storedFavorites).map(id => parseInt(id, 10));
            } catch(e) {}
        }
        
        const isFavorited = currentFavorites.includes(colorId);
        const newFavorites = isFavorited
            ? currentFavorites.filter(id => id !== colorId)
            : [...currentFavorites, colorId];
        
        // Save to storage
        localStorage.setItem('paintStoreFavorites', JSON.stringify(newFavorites));
        
        // Dispatch custom event so other components on the same page know to update
        window.dispatchEvent(new Event('favoritesChanged'));
    };

    const isFavorite = (rawColorId) => {
        const colorId = parseInt(rawColorId, 10);
        return favorites.includes(colorId);
    };

    return { favorites, toggleFavorite, isFavorite };
}
