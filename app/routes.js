//var Sentence = require('./models/sentence');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connection;
var Sentence = db.collection('label_it');


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var count;

module.exports = function (app) {
    // get a sentence
    app.get('/api/sentences/:sentence_id', function (req, res) {
        id = +req.params.sentence_id;
        var sentence = Sentence.findOne({
            id: id
        }, function (err, s) {
            if (err) throw err;
            console.log(s);
            res.json(s);
        });
    });

    // Sends sentence count 
    app.get('/api/count', function (req, res) {
        Sentence.count({}, function (e, c) {
            res.json({
                "count": c
            });
        });
    });

    // Sends a response if a sentence has appeard before or not 
    app.get('/api/appeard/:id', function (req, res) {
        Sentence.findOne({
            id: +req.params.id
        }, function (err, s) {
            if (err) throw err;
            res.json(s['has_appeard']);
        });
    });

    // Get tagged count 
    app.get('/api/tagged/count', function (req, res) {
        Sentence.count({
            has_tagged: true
        }, function (e, c) {
            res.json({
                "tagged_count": c
            });
        });
    });

    // Sends a post request
    app.post('/api/sentences', urlencodedParser, function (req, res) {

        console.log("POST REQUEST: " + req.body.id);

        Sentence.findOneAndUpdate({
            id: req.body.id
        }, {
            $set: {
                is_positive: req.body.is_positive,
                is_negative: req.body.is_negative,
                is_love: req.body.is_love,
                is_hatred: req.body.is_hatred,
                is_neutral: req.body.is_neutral,
                has_appeard: req.body.has_appeard,
                has_tagged: req.body.has_tagged
            }
        }, function (err, doc) {
            console.log(doc);
            res.json(doc);
        })
    });

    // Application 
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');

        // loads number of sentences
        Sentence.count({}, function (e, c) {
            console.log("COUNT: " + c);
            count = c;
        })
    });
}
