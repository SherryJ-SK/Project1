
$(document).ready(function () {
<<<<<<< HEAD
    $(document).foundation();
    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster

    $("#searchBtn").on("click", function () {
        console.log('search buttn clicked');
=======

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));

    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster
    var checker = false;

    $("#searchbtn").on("click", function () {
>>>>>>> 3b3a0343db5b33ae1ead12be923bb6d6289177f1
        event.preventDefault();
        $(".displayEvents").empty();
        grabResponse();
    });

    function grabResponse() {
        var searchInput = $("#searchInput").val(); //keyword


        var country = "&countryCode=AU"; //country
        if ($("#category").val() == null) {
            var classificaiton = ""; //classification
        } else {
            var classificaiton = "&classificationName=" + $("#category").val();
        };

        // var startDate = "&localStartDateTime=2019-12-01T01:00:00"; //date
        // var endDate = "&localStartEndDateTime=2020-08-01T24:00:00";
        //"Query param: localStartEndDateTime - Range must be of a valid format.  
        //use * to designate an unbounded value. 
        //{example: range less then *,2020-08-01T14:00:00 greater: 2020-08-01T14:00:00,* between: 2020-07-08T14:00:00,2020-08-01T14:00:00}"
        if ($("#numberSeletor").val() == null) {
            var responseNumber = "&size=5"; //response size
        } else {
            var responseNumber = "&size=" + $("#numberSeletor").val();
        };
        //var callSingleEvent = "https://app.ticketmaster.com/discovery/v2/events/" + eventId + ".json?apikey=" + apiKey;
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchInput + country + responseNumber + "&apikey=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            displayEvents(response);
        });
    };


    $("#arrowDown").click(function () {
        event.preventDefault();

        if (checker == false) {
            $("#advanceSearch").attr("hidden", false);
            checker = true;
        } else if (checker == true) {
            $("#advanceSearch").attr("hidden", true);
            checker = false;
        }
    })


    function displayEvents(response) {
        console.log(response);
        for (var i = 0; i < 20; i++) {
            var eventEl = response._embedded.events[i];
            var eventDate = eventEl.dates.start.localDate;
            var newDate = moment(eventDate).format("MMMM Do YYYY");
            var eventTime = eventEl.dates.start.localTime;
            var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a");
            var eventImg = eventEl.images[0].url;
            var eventHeader = eventEl.name;
            var eventLink = eventEl.url;
            var eventId = eventEl.id;
            var displayBox = $(".displayEvents");
            var cardContainer = $("<div class=\"card mt-2\" style=\"width: 18rem;\">");
            cardContainer.append("<img src=" + eventImg + " class=\"card-img-top\" alt=" + eventHeader + "></img>");
            var cardBody = $("<div class=\"card-body\">");
            var cardLink = $("<a href=" + eventLink + ">");
            cardLink.append("<h5 class=\"card-title\">" + eventHeader + "</h5>");
            cardBody.append(cardLink);
            cardBody.append("<p class=\"card-text\">" + newTime + " " + newDate + "</p>");
            cardBody.append("<a class=\"btn btn-primary saveEvent\" data-id=" + eventId + "><i class=\"fa fa-star\"></i></a>"); //id saveEvent for like buttons

            cardContainer.append(cardBody);
            displayBox.append(cardContainer);

        };

    };

    $(".displayEvents").on("click", ".saveEvent", function () {
        var savedId = $(this).attr("data-id");
        var filted = false;
        var newInput = [{
            "eventId": savedId,
        }];

        var events = JSON.parse(localStorage.getItem("events"));
        if (events == null) {
            events = [newInput];
            localStorage.setItem("events", JSON.stringify(events));
        } else {
            for (var i = 0; i < events.length; i++) {
                if (savedId === events[i][0].eventId) {
                    filted = true;
                }
            };

            if (filted == false) {
                events.push(newInput);
                localStorage.setItem("events", JSON.stringify(events));
            }
        }
    });


    // get local storage from show in the favourite page
    function savedEvents() {

        var savedEventString = localStorage.getItem("events");
        savedEventJSON = JSON.parse(savedEventString);

        if (savedEventJSON !== null) {

            for (var j = 0; j < savedEventJSON.length; j++) {
                console.log(j);
                var savedEventId = savedEventJSON[j][0].eventId;
                var callSingleEvent = "https://app.ticketmaster.com/discovery/v2/events/" + savedEventId + ".json?apikey=" + apiKey;

                $.ajax({
                    url: callSingleEvent,
                    method: "GET"
                }).then(function (response) {
                    console.log(response);

                    var eventDate = response.dates.start.localDate;
                    var newDate = moment(eventDate).format("DD/MM/YYYY");
                    var eventTime = response.dates.start.localTime;
                    var newTime = moment(eventTime, "HH:mm:ss").format("HH:mm");
                    var eventImg = response.images[0].url;
                    var eventHeader = response.name;
                    var eventLink = response.url;

                    var savedEventDiv = $("#savedEventsDiv"); // inside div under title

                    var eventTitle = $("<div class=\"card-header\">");
                    var realTitle = eventTitle.text(eventHeader);

                    var savedEvent = $("<div class=\"card savedEvents\" style=\"width: 100%\">"); //create new div
                    var newImage = $("<img src=" + eventImg + " class=\"card-img-top col-md-4\"  alt=" + eventHeader + "></img>");

                    savedEvent.append(realTitle);

                    var divImg = $("<div class=\"row\">");
                    divImg.append(newImage);

                    var eventLink = $("<a href=" + eventLink + ">");

                    var eventBody = $("<div class=\"eventsBody col-md-8\">");

                    eventBody.append("<p class=\"card-text eventCard pt-3\">" + " Date: " + newDate + "</p>");
                    eventBody.append("<p class=\"card-text eventCard\">" + " Time: " + newTime + "</p>");


                    eventLink.append("<p class=\"card-title\">" + "More information" + "</p>");
                    eventBody.append(eventLink);

                    divImg.append(eventBody)
                    savedEvent.append(divImg);
                    savedEventDiv.append(savedEvent);

                })
            }
        }
    }
    savedEvents();

});
