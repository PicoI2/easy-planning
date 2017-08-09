const express = require('express')
var serveIndex = require('serve-index');

const app = express()

app.use(express.static('.'))

app.use(function(req, res, next) {
    console.log('404: Page not Found', req.url);
    next();
});

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
})