$(document).ready(function () {
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
    });

    $("#prev_btn").on('click', function () {
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