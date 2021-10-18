'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const webhook = (bot) => {
    let router;
    router = express.Router();
    router.use(bodyParser.json());
    router.use((req, res, next) => {
      next();
    });
    methods(router, bot);
    return router;
}

const methods = (router, bot) => {

    const onMessage = ({sender, text, reply}) => {
        reply([
            {text: 'Hey there ' + sender.first_name + '! Welcome to Metropolitan GetUP'}
        ])
    }

    (['message', 'postback']).map(async event => {
        bot.on(event, (payload, reply, actions) => {
            const replyWithDelay = (messages, callback) => {
                if (messages.length === 0) return;
                actions.setTyping(true);
                setTimeout(() => reply(messages[0], err => {
                    if (err) throw err;
                    messages.shift();
                    if (messages.size === 0 && callback) callback(err);
                    replyWithDelay(messages)
                }), 600);
            };

            bot.getProfile(payload.sender.id, (err, profile) => {
                console.log(profile);
                if (err) throw err;
                const sender = Object.assign({}, profile);
                if (event === 'postback') {
                    onMessage({
                        sender,
                        intent: payload.postback.payload,
                        entities: {},
                        text: payload.postback.title,
                        reply: replyWithDelay
                    });
                } else if (event === 'message') {
                    if (payload.message.text) {
                        console.log('nlp: ' + JSON.stringify(payload.message.nlp));
                        const intent = payload.message.nlp.intents[0].name;
                        const entities = payload.message.nlp.entities;
                        const confidence = payload.message.nlp.intents[0].confidence;
                        onMessage({
                            sender,
                            intent,
                            entities,
                            confidence,
                            text: payload.message.text,
                            reply: replyWithDelay
                        })
                    }
                }
            })
        });
    });

    router.get('/', (req, res) => {
         return bot.verify(req, res);
    });

    router.post('/', (req, res) => {
        bot.handleMessage(req.body);
        res.end(JSON.stringify({status: 'ok'}));
    });

}

module.exports = webhook;
