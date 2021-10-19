const uuid = require('uuid');
const _ = require('lodash');
const e = require("express");


const handler = (bot) => {

    (['message', 'postback']).map(async event => {
        bot.on(event, (payload, reply, actions) => {
            //reply with typing bubbles
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
                        nlp: payload.message.nlp,
                        text: payload.message.text,
                        reply: replyWithDelay
                    });
                } else if (event === 'message') {
                    if (payload.message.text) {
                        onMessage({
                            sender,
                            nlp: payload.message.nlp,
                            text: payload.message.text,
                            reply: replyWithDelay
                        })
                    }
                }
            })
        });
    });
}

const onMessage = ({sender, nlp, text, reply}) => {

    const greeting = getTrait(nlp, 'wit$greeting');
    if (greeting && greeting.confidence > 0.8) {
        reply([
            {text: 'Hey ' + sender.first_name + ', welcome to Metropolitan GetUp!'}
        ])
    }else {
        reply([
            {
                text: 'Utterance: ' + text + '\nIntent: ' + intent + '\nConfidence Score: ' + confidence
            },
            {
                text: 'Entities: \n' + JSON.stringify(entities, null, 2)
            }
        ]);
    }
}

const getTrait = (nlp, name) => {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}


module.exports = handler;
