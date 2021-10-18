const uuid = require('uuid');
const _ = require('lodash');
const e = require("express");


const handler = (bot) => {
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
}

const onMessage = ({sender, intent, entities, confidence, text, reply}) => {
    reply([
        {
            text: 'Utterance: ' + text  +  '\n Intent: ' + intent + '\n Confidence Score: ' + confidence
        },
        {
            text: 'Entities: ' + JSON.stringify(entities, null, 2)
        }
    ]);
}


module.exports = handler;
