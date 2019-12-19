$(document).ready(function () {

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));

    function savedEvents() {
        var savedEventString = localStorage.getItem("selected");
        savedEventJSON = JSON.parse(savedEventString);
        if (savedEventJSON !== null) {
            for (var j = 0; j < savedEventJSON.length; j++) {

                var eventDate = savedEventJSON[j][0].eventDate;
                var eventTime = savedEventJSON[j][0].eventTime;
                var eventImg = savedEventJSON[j][0].eventImg;
                var eventHeader = savedEventJSON[j][0].eventName;
                var eventLink = savedEventJSON[j][0].eventLink;
                var savedEventDiv = $("#savedEventsDiv"); // inside div under title
                var eventTitle = $("<div class=\"card-header\">");
                var realTitle = eventTitle.text(eventHeader);
                var savedEvent = $("<div class=\"card savedEvents\" style=\"width: 100%\">"); //create new div
                var newImage = $("<img src=" + eventImg + " class=\"card-img-top col-md-4\"  alt=" + eventHeader + "></img>");

                savedEvent.append(realTitle);

                var divImg = $("<div class=\"row\">");
                divImg.append(newImage);

                var eventLink = $("<a href=" + eventLink + ">");
                var eventBody = $("<div class=\"eventsBody col-md-6\">");

                eventBody.append("<p class=\"card-text eventCard pt-3\">" + " Date: " + eventDate + "</p>");
                eventBody.append("<p class=\"card-text eventCard\">" + " Time: " + eventTime + "</p>");
                eventLink.append("<p class=\"card-title\">" + "More information" + "</p>");

                var deleteDiv = $("<div>").addClass('deleteBtn col-md-2');
                var deleteBtn = $("<button>").addClass('btn btn-light deleteBtn fa fa-trash-o');
                deleteBtn.attr('id', eventHeader);

                eventBody.append(eventLink);
                divImg.append(eventBody);

                deleteDiv.append(deleteBtn);
                divImg.append(deleteDiv);

                savedEvent.append(divImg);
                savedEventDiv.append(savedEvent);

                $("button").on("click", function () {
                    removeEvent()
                });

            }

        };

    };

    savedEvents();

//remove button
    function removeEvent() {
        event.preventDefault();
        console.log('button clicked');

        var savedEventString = localStorage.getItem("events");
        savedEventJSON = JSON.parse(savedEventString);

        var eventId = $(this).attr("id");
        console.log(eventId);

        if (savedEventJSON !== null) {
            for (var x = 0; x < savedEventJSON.length; x++) {

                if (eventId == savedEventJSON[x][0].eventId) {
                    // localStorage.removeItem("events", eventId);
                }
            }
        }
    };

});