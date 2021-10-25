'use strict';

const fs = require('fs');
const https = require('https');
const app = require('./src/app');

// setting the environment variables configuration
require('dotenv').config();

// setting the server options with the certificate and 
// certificate key in order to start our HTTPS server
https.createServer({
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')}, app)
    .listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}!`)
    });
