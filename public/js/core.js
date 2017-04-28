$(document).ready(function () {
    var sentiment_ids = [
        "#sentiment_positive",
        "#sentiment_negative",
        "#sentiment_anger",
        "#sentiment_love",
        "#sentiment_hatred",
        "#sentiment_neutral"
    ];

    var label_sentiment_ids = [
        "#label_sentiment_positive",
        "#label_sentiment_negative",
        "#label_sentiment_anger",
        "#label_sentiment_love",
        "#label_sentiment_hatred",
        "#label_sentiment_neutral"
    ];

    // Hiding the tag indicator at first 
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
                tagged = response['has_tagged'];
                $("#tag_sentence").text(response['text']);
                $("#loaded_id").text(id);
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
                text: "ChAGOL"
            },
            success: function (response) {
                console.log(response);
            }
        });
    }

    // Check if at least one sentiment is checked 
    function is_checked_atleast_one() {
        var has_checked = false;
        for (var i = 0; i < sentiment_ids.length; i++) {
            has_checked = $(sentiment_ids[i]).prop("checked");
            if (has_checked) return true;
        }
        return false;
    }

    // Reset the form
    function reset_options() {
        // Uncheck all of the checked buttons 
        label_sentiment_ids.forEach(function (lsi) {
            $(lsi).attr("class", "btn btn-primary sentiment")
                .attr("aria-pressed", false);
        });

        sentiment_ids.forEach(function (si) {
            $(si).attr("aria-pressed", false);
            $(si).prop("checked", false);
        });
    }

    // Post data
    function post_data() {

    }


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


    // Initially set the first one 
    $.ajax({
        type: "GET",
        url: "/api/sentences/1",
        success: function (sentence) {
            $("#tag_sentence").text(sentence['text']);
            $("#loaded_id").text("1");
            $("#total_count").text("" + sentence_count);
        }
    });

    // On next button click do the followings
    // 1. Get a sentence from database at random 
    // 2. Reset the previous selected values from checkbox
    // 3. Save the current checkboxes values 
    $("#next_btn").on('click', function () {

        console.log("HAS CHECKED AT LEAST ONE : " + is_checked_atleast_one());

        tag_current_sentence(cursor);

        cursor += 1;

        if (cursor > sentence_count) cursor = sentence_count;

        get_sentence(cursor);

        reset_options();

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

    // Load sentence on request
    $("#load_sentence_btn").on('click', function () {
        var s_id = +$("#load_sentence_id").val();
        if (s_id > sentence_count) {
            alert("Out of bound error, enter a number within the range");
        } else {
            get_sentence(s_id);
        }
    });

});