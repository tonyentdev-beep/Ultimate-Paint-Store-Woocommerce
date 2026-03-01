const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'admin/index': path.resolve(process.cwd(), 'src/admin', 'index.js'),
        'frontend/index': path.resolve(process.cwd(), 'src/frontend', 'index.js'),
    },
    output: {
        ...defaultConfig.output,
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js',
    },
};
