'use strict';

const {EventEmitter} = require('events');
const request = require('request-promise');

class Bot extends EventEmitter {

    constructor(opts) {
        super();

        opts = opts || {};
        if (!opts.token) {
            throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart');
        }
        this.graphUrl = opts.graphUrl ? opts.graphUrl : 'https://graph.facebook.com/v11.0'
        this.token = opts.token;
        this.appSecret = opts.appSecret || false;
        this.verifyToken = opts.verifyToken || false;
    }

    getProfile = (psid, callback) => {
        return request({
            method: 'GET',
            uri: this.graphUrl + '/' + psid,
            qs: {fields: 'first_name,last_name,profile_pic,gender,timezone,locale', access_token: this.token},
            json: true
        }).then(data => {
            if(data.error) return Promise.reject(data.error);
            if(!callback) return  data;
            callback(null, data);
        }).catch(err => {
            if(!callback) return Promise.reject(err);
            callback(err);
        });
    }

    sendMessage = (psid, payload, callback) => {
        return request({
            method: 'POST',
            uri: this.graphUrl + '/me/messages',
            qs: {access_token: this.token},
            json: {
                recipient: {
                    id: psid
                },
                message: payload
            }
        }).then(data => {
            if(data.error) return Promise.reject(data.error);
            if(!callback) return data;
            callback(null, data);
        }).catch(err => {
            if(!callback) return Promise.reject(err);
            callback(err);
        });
    }

    sendSenderAction = (psid, action, callback) => {
        return request({
            method: 'POST',
            uri: this.graphUrl + '/me/messages',
            qs: {access_token: this.token},
            json: {
                recipient: {
                    id: psid,
                },
                sender_action: action
            }
        }).then(data => {
            if(data.error) return Promise.reject(data.error);
            if(!callback) return data;
            callback(null, 2);
        }).catch(err => {
            if (!callback) return Promise.reject(err)
            callback(err)
        });
    }


    handleMessage = (payload) => {
        let entries = payload.entry;
        entries.forEach((entry) => {
            let events = entry.messaging;
            events.forEach((event) => {
                if (event.message) {
                    if (event.message.is_echo) {
                        this.handleEvent('echo', event);
                    } else {
                        this.handleEvent('message', event);
                    }
                }

                if (event.postback) {
                    this.handleEvent('postback', event);
                } else if (event.delivery) {
                    this.handleEvent('delivery', event);
                } else if (event.read) {
                    this.handleEvent('read', event);
                } else if (event.optin) {
                    this.handleEvent('optin', event);
                } else if (event.referral) {
                    this.handleEvent('referral', event);
                }
            });
        });
    }

    getActionsObject = (event) => {
        return {
            setTyping: (state) => {
                let senderTypingAction = state ? 'typing_on' : 'typing_off';
                this.sendSenderAction(event.sender.id, senderTypingAction);
            },
            markRead: this.sendSenderAction.bind(this, event.sender.id, 'mark_seen')
        }
    }

    verify = (req, res) => {
        let query = req.query;
        if (query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === this.verifyToken) {
            return res.end(query['hub.challenge']);
        }
        return res.end('Verify Error - Wrong validation token');
    }

    handleEvent = (type, event) => {
        this.emit(type, event, this.sendMessage.bind(this, event.sender.id), this.getActionsObject(event));
    }

}

module.exports = Bot;
