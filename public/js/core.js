$(document).ready(function () {

    // Class for sentiment data 
    class SentimentData {
        constructor(id) {
            this.id = id;
            this.is_positive = false;
            this.is_negative = false;
            this.is_love = false;
            this.is_anger = false;
            this.is_hatred = false;
            this.is_neutral = false;
            this.has_appeard = false;
            this.has_tagged = false;
        }

        get_data() {
            return {
                "id": this.id,
                "is_positive": this.is_positive,
                "is_negative": this.is_negative,
                "is_neutral": this.is_neutral,
                "is_love": this.is_love,
                "is_hatred": this.is_hatred,
                "is_anger": this.is_anger,
                "has_appeard": this.has_appeard,
                "has_tagged": this.has_tagged
            }
        }
    }

    // The div is shown on successful tag 
    var alert_div = "<div class='alert alert-success text-center offset-md-3' role='alert' id='tag_successful' style='max-width: 50%;'><strong>Tagged successfully</strong></div>";

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

    // Tag-badge dictionary 
    var tag_badge_dict = {
        "is_neutral": "badge-default",
        "is_hatred": "badge-warning",
        "is_positive": "badge-success",
        "is_negative": "badge-danger",
        "is_love": "badge-info",
        "is_anger": "badge-primary"
    };

    // Tag Text Dictionary
    var tag_text_dict = {
        "is_neutral": "Neutral",
        "is_hatred": "Hatred",
        "is_positive": "Positive",
        "is_negative": "Negative",
        "is_anger": "Anger",
        "is_love": "Love"
    };

    // Shows the tags on the page
    function show_tags(response) {
        var tagged = [];
        for (var key in response) {
            if (response[key] === true && key !== "has_appeard" && key != "has_tagged") {
                tagged.push(key);
            }
        }
        // Now showing the tags
        tagged.forEach(function (value) {
            $("#tag_status").append("<span style='margin-left: 2px;' class='badge badge-pill badge-primary " + tag_badge_dict[value] + "'>" + tag_text_dict[value] + "</span>");
        });
    }

    // Hiding the tag indicator at first 
    $("#tag_indicator").hide();

    var cursor = 1;
    var sentence_count = 0;

    // Check if a sentence has been tagged or not, if tagged it will not accept further tag
    function get_sentence(id) {
        var tagged = null;
        var res;
        $.ajax({
            type: "GET",
            url: "/api/sentences/" + id,
            success: function (response) {
                tagged = response['has_tagged'];
                $("#tag_sentence").text(response['text']);
                $("#loaded_id").text(id);
                res = response;
            }
        }).then(function () {
            // Remove existing displayed tags
            $("#tag_status > span").remove();

            if (tagged === false) {
                $("#tag_indicator").hide();
            } else if (tagged === true) {
                $("#tag_indicator").show();
                show_tags(res);
            } else {
                console.log("NOT TAGGED ERROR");
            }
        })
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

    // Helping function for increasing and decreasing iterator [cyclic rotation]
    function increase_cursor() {
        cursor += 1;
        if (cursor > sentence_count) cursor = 1;
    }

    function decrease_cursor() {
        cursor -= 1;
        if (cursor < 1) cursor = sentence_count;
    }

    /// Gets data from checkbox and save it to the sentiment_data object 
    function set_data_from_checkbox(sentiment_data) {
        sentiment_data.is_love = $("#sentiment_love").prop("checked");
        sentiment_data.is_hatred = $("#sentiment_hatred").prop("checked");
        sentiment_data.is_neutral = $("#sentiment_neutral").prop("checked");
        sentiment_data.is_positive = $("#sentiment_positive").prop("checked");
        sentiment_data.is_negative = $("#sentiment_negative").prop("checked");
        sentiment_data.is_anger = $("#sentiment_anger").prop("checked");
    }




    // Get sentence count 
    $.ajax({
        type: 'GET',
        url: '/api/count',
        success: function (res) {
            sentence_count = +res['count'];
            $("#total_count").text(sentence_count);
        },
        dataType: 'json'
    }).then(function () {
        // Update tag count
        $.ajax({
            type: "GET",
            url: "/api/tagged/count",
            success: function (response) {
                $("#tagged_count").text(response['tagged_count']);
            }
        });
    });


    // Initially set the first one 
    // $.ajax({
    //     type: "GET",
    //     url: "/api/sentences/1",
    //     success: function (sentence) {
    //         $("#tag_sentence").text(sentence['text']);
    //         $("#loaded_id").text("1");
    //         $("#total_count").text("" + sentence_count);
    //     }
    // });
    // Initially load the first one 
    get_sentence(1);

    // Select all of the content on click the load input text 
    $("#load_sentence_id").on('click', function () {
        $(this).select();
    });

    // On next button click do the followings
    // 1. Get a sentence from database at random 
    // 2. Reset the previous selected values from checkbox
    // 3. Save the current checkboxes values 
    $("#next_btn").on('click', function () {

        var has_tagged = false;

        $.ajax({
            type: "GET",
            url: "/api/sentences/" + cursor,
            success: function (response) {
                has_tagged = response['has_tagged'];
            }
        }).then(function () {
            if (!has_tagged && is_checked_atleast_one()) {

                // Get button states
                var sentiment_data = new SentimentData(cursor);
                sentiment_data.has_appeard = true;
                sentiment_data.has_tagged = true;
                set_data_from_checkbox(sentiment_data);

                $.ajax({
                    type: "POST",
                    url: "/api/sentences",
                    data: sentiment_data.get_data(),
                    success: function (response) {
                        // Add a indicator 
                        $("#tag_alert").append(alert_div);
                        setTimeout(function () {
                            $("#tag_successful").remove();
                        }, 500);
                    }
                }).then(function () {
                    // Update tag count
                    $.ajax({
                        type: "GET",
                        url: "/api/tagged/count",
                        success: function (response) {
                            $("#tagged_count").text(response['tagged_count']);
                        }
                    });
                })
            } else {
                // Add other functionalities when not tagged
            }
        }).then(function () {

            reset_options();
            increase_cursor();

            $.ajax({
                type: "GET",
                url: "/api/sentences/" + cursor,
                success: function (response) {
                    get_sentence(cursor);
                }
            });
        });

    });

    // Add same functionalities as next button 
    $("#prev_btn").on('click', function () {
        decrease_cursor();
        get_sentence(cursor);
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
            cursor = s_id;
        }
    });

    // Show corresponding modals
    $("#nav_about").click(function () {
        $("#about_modal").modal('show');
    });

    $("#nav_howto").click(function () {
        $("#howto_modal").modal('show');
    });

    $("#nav_contact").click(function () {
        $("#contact_modal").modal('show');
    });

});