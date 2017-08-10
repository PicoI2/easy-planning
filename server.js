const express = require('express');
var serveIndex = require('serve-index');
var bodyParser  = require('body-parser');
const app = express();

// With theses lines, webpack will run at each file saving.
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
webpackConfig.output.path = '/';
const compiler = webpack(webpackConfig);
app.use('/app/wpk/', webpackDevMiddleware(compiler, {}));

// Add parse of request
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('.'));

// route /task to tasks controller
var tasks = require("./controllers/tasks");
app.use('/task', tasks);

// Function called when others failed
app.use(function(req, res, next) {
    console.log('404: Page not Found', req.url);
    next();
});

// Set listen port
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
})
