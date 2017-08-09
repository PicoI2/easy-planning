const express = require('express');
var serveIndex = require('serve-index');
const app = express();

// With theses lines, webpack will run at each file saving.
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
webpackConfig.output.path = '/';
const compiler = webpack(webpackConfig);
app.use('/app/wpk/', webpackDevMiddleware(compiler, {}));

// Serve static files
app.use(express.static('.'));

// Function called when others failed
app.use(function(req, res, next) {
    console.log('404: Page not Found', req.url);
    next();
});

// Set listen port
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
})