var Sentence = require('./models/sentence');

module.exports = function (app) {
    // get all sentence
    app.get('/api/sentences', function (req, res) {

    });

    app.post('/api/todos', function (req, res) {

    });

    // Application 
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
}