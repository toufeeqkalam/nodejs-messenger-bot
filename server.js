const express = require('express');
const {PORT} = require('./scripts/config/config');
const Bot = require('./scripts/bot/bot');
const CONFIG = require('./scripts/config/config');
const app = express();

const bot = new Bot({
    token: CONFIG.FACEBOOK_ACCESS_TOKEN,
    verifyToken: CONFIG.FACEBOOK_VERIFY_TOKEN,
    appSecret: CONFIG.FACEBOOK_APP_SECRET
});

app.get('/', (req, res) => {
    res.send({status: 'UP'});
});

app.use('/webhook', require('./scripts/routes/webhook')(bot))

app.listen(PORT).on('error', (error) => {
    console.error('Error while starting up server: ' + JSON.stringify(error));
    process.exit(1);
});

console.log('⚡ App listening on port: ' + PORT);

module.exports = app;
