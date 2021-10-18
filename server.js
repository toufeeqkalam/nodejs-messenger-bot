const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/status', (req, res) => {
    res.send({status: 'UP'});
});


module.exports = app;
