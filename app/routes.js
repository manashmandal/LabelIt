var Sentence = require('./models/sentence');

var count;

module.exports = function (app) {
    // get all sentence
    app.get('/api/sentences', function (req, res) {

    });

    app.post('/api/sentences', function (req, res) {

    });

    // Application 
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
        Sentence.count({}, function (e, c) {
            console.log("COUNT: " + c);
            count = c;
        })

        var s = new Sentence({
            id: 1,
            text: "Bal",
            is_positive: true,
            is_negative: true,
            is_love: true,
            is_hatred: true,
            is_neutral: true,
            has_appeard: true,
            has_tagged: true
        }).save(function (err, d) {
            if (!err) {
                console.log("DATA SAVED");
            }
        });
    });
}