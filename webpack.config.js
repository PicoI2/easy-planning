const path = require('path')
module.exports = {
    entry: {
        bundle: './app/main.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './app/wpk'),
    }
};