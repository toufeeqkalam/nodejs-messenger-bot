'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const handler = require('../handler/handler')

const webhook = (bot) => {
    let router;
    router = express.Router();
    router.use(bodyParser.json());
    router.use((req, res, next) => {
      next();
    });
    methods(router, bot);
    handler(bot);
    return router;
}

const methods = (router, bot) => {
    router.get('/', (req, res) => {
         return bot.verify(req, res);
    });

    router.post('/', (req, res) => {
        bot.handleMessage(req.body);
        res.end(JSON.stringify({status: 'ok'}));
    });

}

module.exports = webhook;
