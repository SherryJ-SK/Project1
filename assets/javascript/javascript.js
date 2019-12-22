$(document).ready(function() {
    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));

    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster
    var checker = false;
    var deviceLat = "";
    var deviceLon = "";

    //search button start parse from API on click
    $("#searchbtn").on("click", function() {
        event.preventDefault();
        $(".displayEvents").empty();
        grabResponse();
    });
    //get current device location
    getDeviceLoc();
    //get current device location function
    function getDeviceLoc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSucc, showError);
        };

        function geoSucc(position) {
            deviceLat = position.coords.latitude;
            deviceLon = position.coords.longitude;
        };

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            };

        }
    }

    //parse search result from API
    function grabResponse() {
        //keyword inputed by user
        var searchInput = $("#searchInput").val();

        //country set as AU changed by using geolocation
        //var country = "&countryCode=AU";

        //Classification, set as default none if no input from user
        if ($("#category").val() == null) {
            var classificaiton = "";
        } else {
            var classificaiton = "&classificationName=" + $("#category").val();
        };
        //responsesize, set as default 5 if user input is null
        if ($("#numberSeletor").val() == null) {
            var responseNumber = "&size=5"; //response size
        } else {
            var responseNumber = "&size=" + $("#numberSeletor").val();
        };
        //reponse of the location of current device
        if (deviceLat == null && deviceLon == null) {
            var geoSearch = ""; //response size
        } else {
            var geoSearch = "&latlong=" + deviceLat + "," + deviceLon;
        };
        //API from ticketmaster
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchInput + geoSearch + responseNumber + "&apikey=" + apiKey;
        //parse response from ticketmaster and enter displayEvent function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            displayEvents(response);
        });
    };
    //display more search parameters on click
    $("#arrowDown").click(function() {
            event.preventDefault();
            if (checker == false) {
                $("#advanceSearch").attr("hidden", false);
                checker = true;
            } else if (checker == true) {
                $("#advanceSearch").attr("hidden", true);
                checker = false;
            }
        })
        //display search response for home page
    function displayEvents(response) {
        console.log(response);
        //loop through search response to display them
        for (var i = 0; i < 20; i++) {
            //parse from json for the needed data
            var eventEl = response._embedded.events[i];
            var eventDate = eventEl.dates.start.localDate;
            var newDate = moment(eventDate).format("MMMM Do YYYY");
            var eventTime = eventEl.dates.start.localTime;
            var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a");
            var eventImg = eventEl.images[0].url;
            var eventHeader = eventEl.name;
            var eventLink = eventEl.url;
            var eventId = eventEl.id;
            //display in display area using card 
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

    //search results has a "like" button to add them into favourite page
    //on click these "like" buttons can add them to local storage
    $(".displayEvents").on("click", ".saveEvent", function() {
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
            //loop through localstorage first to see if there is repetitive events
            //to prevent from repetitive saving
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
    // get local storage and show in the favourite page
    function savedEvents() {
        var savedEventString = localStorage.getItem("events");
        savedEventJSON = JSON.parse(savedEventString);
        //check if there is data stored in localstorage to prevent error
        if (savedEventJSON !== null) {
            //loop through localstorage to search them again using ID search from Ticketmaster API
            for (var j = 0; j < savedEventJSON.length; j++) {
                console.log(j);
                var savedEventId = savedEventJSON[j][0].eventId;
                var callSingleEvent = "https://app.ticketmaster.com/discovery/v2/events/" + savedEventId + ".json?apikey=" + apiKey;
                $.ajax({
                    url: callSingleEvent,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);
                    //parse required data from json
                    var eventDate = response.dates.start.localDate;
                    var newDate = moment(eventDate).format("DD/MM/YYYY");
                    var eventTime = response.dates.start.localTime;
                    var newTime = moment(eventTime, "HH:mm:ss").format("HH:mm");
                    var eventImg = response.images[0].url;
                    var eventHeader = response.name;
                    var eventLink = response.url;
                    //days before event you like
                    var daysLeft = Math.abs(moment().diff(eventDate, "days"));

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
                    //event date appended int card
                    eventBody.append("<p class=\"card-text eventCard pt-3\">" + " Date: " + newDate + "</p>");
                    //event time appended into card
                    eventBody.append("<p class=\"card-text eventCard\">" + " Time: " + newTime + "</p>");
                    //days left appended into card
                    eventBody.append("<p class=\"card-text eventCard\">" + daysLeft + " Days left</p>");
                    eventLink.append("<p class=\"card-title\">" + "More information" + "</p>");
                    eventBody.append(eventLink);
                    divImg.append(eventBody)
                    savedEvent.append(divImg);
                    savedEventDiv.append(savedEvent);
                })
            }
        }
    }

    //call function to display in favourite page on load
    savedEvents();

});