import { useState } from '@wordpress/element';

const App = ({ familyId }) => {
    return (
        <div className="paint-store-product-builder">
            <h2>Paint Product Builder</h2>
            <p>Product Family ID: {familyId}</p>
            {/* We will build the rest of the interactive UI here */}
        </div>
    );
};

export default App;
