$(document).ready(function () {
    $("#tag_indicator").hide();

    var cursor = 1;
    var sentence_count = 0;

    // Check if a sentence has been tagged or not, if tagged it will not accept further tag
    function get_sentence(id) {
        var tagged = null;
        $.ajax({
            type: "GET",
            url: "/api/sentences/" + id,
            success: function (response) {
                console.log("SUCCESS");
                tagged = response['has_tagged'];
                $("#tag_sentence").text(response['text']);
            }
        }).then(function () {
            if (tagged === false) {
                console.log("NOT TAGGED");
                $("#tag_indicator").hide();
            } else if (tagged === true) {
                console.log("TAGGED");
                $("#tag_indicator").show();
            } else {
                console.log("NOT TAGGED ERROR");
            }
        })
    }

    function tag_current_sentence(_id_) {
        $.ajax({
            url: "/api/sentences/",
            type: "POST",
            data: {
                id: +_id_,
                text: "BALCHAL"
            },
            success: function (response) {
                console.log(response);
            }
        });
    }

    sentiment_ids = [
        "#sentiment_positive",
        "#sentiment_negative",
        "#sentiment_anger",
        "#sentiment_love",
        "#sentiment_hatred",
        "#sentiment_neutral"
    ];

    label_sentiment_ids = [
        "#label_sentiment_positive",
        "#label_sentiment_negative",
        "#label_sentiment_anger",
        "#label_sentiment_love",
        "#label_sentiment_hatred",
        "#label_sentiment_neutral"
    ];

    // Initially set the first one 
    $.ajax({
        type: "GET",
        url: "/api/sentences/1",
        success: function (sentence) {
            $("#tag_sentence").text(sentence['text']);
        }
    });

    // Get sentence count 
    $.ajax({
        type: 'GET',
        url: '/api/count',
        success: function (res) {
            sentence_count = +res['count'];
            console.log("SENTENCE COUNT : " + res['count']);
        },
        dataType: 'json'
    });


    // On next button click do the followings
    // 1. Get a sentence from database at random 
    // 2. Reset the previous selected values from checkbox
    // 3. Save the current checkboxes values 
    $("#next_btn").on('click', function () {


        console.log("NExt");

        // Uncheck all of the checked buttons 
        label_sentiment_ids.forEach(function (lsi) {
            $(lsi).attr("class", "btn btn-primary sentiment")
                .attr("aria-pressed", false);
        })

        sentiment_ids.forEach(function (si) {
            $(si).attr("aria-pressed", false);
            $(si).prop("checked", false);
        })

        sentiment_ids.forEach(function (sentiment_id) {
            console.log(sentiment_id + " prop: " + $(sentiment_id).prop('checked'));
            // console.log(sentiment_id + " changed: " + $(sentiment_id + ":checked").length);
        });


        tag_current_sentence(cursor);

        cursor += 1;

        if (cursor > sentence_count) cursor = sentence_count;

        get_sentence(cursor);



    });

    $("#prev_btn").on('click', function () {
        cursor -= 1;

        if (cursor < 1) cursor = 1;

        get_sentence(cursor);

        console.log("Prev");
    });

    // Get selected items 
    $("#sentiment_positive").change(function () {
        console.log($("#sentiment_positive:checked").length);
    })


    // Debugging 
    sentiment_ids.forEach(function (sentiment_id) {
        $(sentiment_id).change(function () {
            console.log(sentiment_id + " prop: " + $(sentiment_id).prop('checked'));
        });
    });
})