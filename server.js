const express = require('express');
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('⚡ Application started on port: ' + PORT);
})

module.exports = app;
