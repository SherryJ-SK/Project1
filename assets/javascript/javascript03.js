$(document).ready(function () {

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));

    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster
    var checker = false;
    var deviceLat = "";
    var deviceLon = "";

    //search button start parse from API on click
    $("#searchbtn").on("click", function () {
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
        }).then(function (response) {
            console.log(response);
            displayEvents(response);
        });

    };

    //display more search parameters on click
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
            var cardContainer = $("<div class=\"card mt-2 saveEventDiv\" style=\"width: 18rem;\">");
            cardContainer.append("<img src=" + eventImg + " class=\"card-img-top\" alt=" + eventHeader + "></img>");
            var cardBody = $("<div class=\"card-body\">");
            var cardLink = $("<a class=\"links\" href=" + eventLink + ">");
            cardLink.append("<h5 class=\"card-title\" id=" + eventHeader + ">" + eventHeader + "</h5>");
            cardBody.append(cardLink);
            cardBody.append("<p class=\"card-text time\">" + newTime + "</p>");
            cardBody.append("<p class=\"card-text date\">" + newDate + "</p>");
            cardBody.append("<button class=\"btn btn-primary saveEvent\" id=" + eventId + "><i class=\"fa fa-star\"></i></button>"); //id saveEvent for like buttons

            cardContainer.append(cardBody);
            displayBox.append(cardContainer);

            var savedNameString = localStorage.getItem("events");
            savedNameJSON = JSON.parse(savedNameString) || [];

            var newInput = [{
                "eventId": eventId,
                "eventName": eventHeader,
                "eventDate": newDate,
                "eventTime": newTime,
                "eventImg": eventImg,
                "eventLink": eventLink
            }];

            savedNameJSON.push(newInput);
            localStorage.setItem("events", JSON.stringify(savedNameJSON));

        };

    };

    //search results has a "like" button to add them into favourite page
    //on click these "like" buttons can add them to local storage
    // $(".displayEvents").on("click", ".saveEvent", saveEventToLocal);

    // function saveEventToLocal() {
    //     console.log(this);

    //     var savedName = $(this).attr("eventHeader");
    //     var filted = false;
    //     var newInput = [{
    //         "eventName": savedName,
    //     }];

    //     var events = JSON.parse(localStorage.getItem("events"));
    //     if (events == null) {
    //         events = [newInput];
    //         localStorage.setItem("events", JSON.stringify(events));
    //     } else {
    //         //loop through localstorage first to see if there is repetitive events
    //         //to prevent from repetitive saving
    //         for (var i = 0; i < events.length; i++) {
    //             if (savedName === events[i][0].savedName) {
    //                 filted = true;
    //             }
    //         };

    //         if (filted == false) {
    //             events.push(newInput);
    //             localStorage.setItem("events", JSON.stringify(events));
    //         }
    //     }
    // }

    $(".displayEvents").on("click", ".saveEvent", saveEventToLocal);

    function saveEventToLocal() {

        var savedName = $(this).attr("id");
        var eventsList = JSON.parse(localStorage.getItem("events"));

        console.log(eventsList);

        for (var a = 0; a < eventsList.length; a++){
            if (savedName == eventsList[a][0].eventId){
                var selectedString = localStorage.getItem("selected");
                selectedJSON = JSON.parse(selectedString) || [];
    
                var selectedInput = [{
                    "eventId": eventsList[a][0].eventId,
                    "eventName": eventsList[a][0].eventName,
                    "eventDate": eventsList[a][0].eventDate,
                    "eventTime": eventsList[a][0].eventTime,
                    "eventImg": eventsList[a][0].eventImg,
                    "eventLink": eventsList[a][0].eventLink
                }];
    
                selectedJSON.push(selectedInput);
                localStorage.setItem("selected", JSON.stringify(selectedJSON));
    
            }
        }

    }
});