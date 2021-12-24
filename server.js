const path = require('path');
const express = require('express');
const app = require('./public/dist/App.js');

const server = express();

server.use(express.static(path.join(__dirname, 'public', 'dist')));

server.get('*', function(req, res) {
    const { html } = app.render({ url: req.url });

    res.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <link rel='stylesheet' href='/global.css'>
                <link rel='stylesheet' href='bundle/bundle.css'>
            </head>
            <body>
                <div id='app'>${html}</div>
                <script src='bundle/bundle.js'></script>
            </body>
        </html>
    `);

    res.end();
});

const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
