$(document).ready(function() {

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));

    function savedEvents() {
        $("#savedEventDiv").empty();
        var savedEventString = localStorage.getItem("selected");
        savedEventJSON = JSON.parse(savedEventString);
        if (savedEventJSON !== null) {
            for (var j = 0; j < savedEventJSON.length; j++) {

                var eventDate = savedEventJSON[j][0].eventDate;
                var newDate = moment(eventDate).format("MMMM Do YYYY");
                var eventTime = savedEventJSON[j][0].eventTime;
                var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a")
                var eventImg = savedEventJSON[j][0].eventImg;
                var eventHeader = savedEventJSON[j][0].eventName;
                var eventLink = savedEventJSON[j][0].eventLink;
                var eventId = savedEventJSON[j][0].eventId;
                var daysLeft = Math.abs(moment().diff(eventDate, "days"));

                var savedEventDivEl = $('#savedEventDiv');
                var savedEventEl = $('<div>').addClass('row savedEvents');
                var eventTitleEl = $('<div>').addClass('card-header col s12 m12 l12 hoverable ');
                var secondRowDivEl = $('<div>').addClass('row secondRow');
                var newImageDivEl = $('<div>').addClass('card-image col s12 m5 l5');
                var newImageEl = $('<img>');
                var eventBodyEl = $('<div>').addClass('eventBody col s12 m5 l5');
                var eventDateEl = $('<p>').addClass('card-text eventCard pt-3');
                var eventTimeEl = $('<p>').addClass('card-text eventCard');
                var timeLeftEl = $('<p>').addClass('card-text eventCard');
                var eventLinkEl = $('<a>').addClass('card-title');
                var deleteEventBtnEl = $('<a>').addClass('waves-effect waves-light btn deleteBtn col s2 m2 l2');
                var deleteSymbolEl = $('<i>').addClass('fa fa-trash');

                eventTitleEl.text(eventHeader);
                eventTitleEl.css({ 'width': '100%', 'border-bottom': '1px solid', 'border-color': '#666666', 'padding': '10px 10px', 'background-color': '#cccccc' });
                savedEventEl.css({ 'width': '100%', 'border': '1px solid', 'border-color': '#666666' });
                newImageEl.attr('src', eventImg);
                newImageEl.attr('alt', eventHeader);
                newImageEl.css('width', '100%');
                eventDateEl.html('<p>Date: ' + newDate + '</p>');
                eventTimeEl.html('<p>Time: ' + newTime + '</p>');
                timeLeftEl.html('<p>' + daysLeft + ' Days left</p>');
                eventLinkEl.attr('href', eventLink);
                eventLinkEl.html('<p>More information</p>');
                deleteEventBtnEl.attr('id', eventId);
                secondRowDivEl.css('margin-bottom', '0');

                savedEventDivEl.append(savedEventEl);
                savedEventEl.append(eventTitleEl);
                savedEventEl.append(secondRowDivEl);
                secondRowDivEl.append(newImageDivEl);
                secondRowDivEl.append(eventBodyEl);
                secondRowDivEl.append(deleteEventBtnEl);
                newImageDivEl.append(newImageEl);
                eventBodyEl.append(eventDateEl);
                eventBodyEl.append(eventTimeEl);
                eventBodyEl.append(timeLeftEl);
                eventBodyEl.append(eventLinkEl);
                deleteEventBtnEl.append(deleteSymbolEl);

            }
        };
        $(".deleteBtn").on("click", function() {
            console.log("clicked");
            var targetId = $(this).attr("id");
            removeEvent(targetId);
        });
    };

    savedEvents();

    // remove button
    function removeEvent(targetId) {
        // var targetId = $(this).attr("id");

        var savedEventString = localStorage.getItem("selected");
        var savedEventJSON = JSON.parse(savedEventString);

        console.log(targetId);
        for (var x = 0; x < savedEventJSON.length; x++) {

            if (targetId === savedEventJSON[x][0].eventId) {
                console.log(x);
                savedEventJSON.splice(x, 1);
                localStorage.setItem('selected', JSON.stringify(savedEventJSON));

                savedEvents();
            }
        }

    };

});