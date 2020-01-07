$(document).ready(function() {

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));
    // TicketMaster
    // var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap"
    // backup
    var apiKey = "93sIViJs6exJuIwcNtKqMSGIAdp1eJV9"
    var checker = false;
    var deviceLat = "";
    var deviceLon = "";

    // search button start parse from API on click
    $("#searchBtn").on("click", function() {
        event.preventDefault();
        $(".displayEvents").empty();
        localStorage.removeItem("events"); // clean localstorage
        grabResponse();
    });
    // get current device location
    getDeviceLoc();
    // get current device location function
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
                    // "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    // "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    // "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    // "An unknown error occurred."
                    break;
            };
        }
    }

    // parse search result from API
    function grabResponse() {
        // keyword inputed by user
        var searchInput = $("#searchInput").val();

        // country set as AU changed by using geolocation
        // var country = "&countryCode=AU";

        // Classification, set as default none if no input from user
        if ($("#category").val() == null) {
            var classification = "";
        } else {
            classification = "&classificationName=" + $("#category").val();
        };
        // responsesize, set as default 5 if user input is null
        if ($("#numberSelector").val() == "") {
            var responseNumber = "&size=20"; //response size
        } else {
            responseNumber = "&size=" + $("#numberSelector").val();
        };
        // reponse of the location of current device
        if (deviceLat == "" && deviceLon == "") {
            var geoSearch = ""; //response size
        } else {
            geoSearch = "&latlong=" + deviceLat + "," + deviceLon;
        };
        // API from ticketmaster
        console.log(searchInput);
        console.log(classification);
        console.log(responseNumber);
        console.log(geoSearch);

        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchInput + responseNumber + geoSearch + classification + "&apikey=" + apiKey;
        console.log(queryURL);
        // parse response from ticketmaster and enter displayEvent function
        $.ajax({
            type: 'GET',
            url: queryURL,
            dataType: 'JSON',
            success: function(response) {
                console.log(response);
                displayEvents(response);
            },
            error: function() {
                alert("Error, 404 (not found)!")
            }
        });
        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function(response) {
        //     console.log(response);
        //     displayEvents(response);
        // });
    };

    // display more search parameters on click
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

    // display search response for home page
    function displayEvents(response) {
        console.log(response);
        var arrayLength = eventDisplayNumber();
        console.log(arrayLength);
        //loop through search response to display them
        var eventExist = response._embedded;
        console.log(eventExist);
        if (eventExist == null) {
            alert('Error, no response received!')
        } else {
            var eventArray = response._embedded.events.length;
            console.log(eventArray);
            for (var i = 0; i < eventArray; i++) {
                // parse from json for the needed data
                var eventEl = response._embedded.events[i];
                var eventDate = eventEl.dates.start.localDate;
                var newDate = moment(eventDate).format("MMMM Do YYYY");
                var eventTime = eventEl.dates.start.localTime;
                var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a");
                var eventImg = eventEl.images[1].url;
                var eventHeader = eventEl.name;
                var eventLink = eventEl.url;
                var eventId = eventEl.id;
                // display in display area using card 
                var displayBoxEl = $('.displayEvents');
                var cardContainerEl = $('<div>').addClass('card-content col s12 m4 l3 hoverable');
                var cardDivEl = $('<div>').addClass('card saveEventDiv');
                var imageDivEl = $('<div>').addClass('card-image');
                var imageEl = $('<img>');
                var cardLinkEl = $('<a>').addClass('links card-title');
                var cardContentEl = $('<div>').addClass('card-content');
                var eventTimeEl = $('<p>').addClass('time');
                var eventDateEl = $('<p>').addClass('date');
                var saveEventBtnEl = $('<a>').addClass('waves-effect waves-orange btn-floating saveEvent halfway-fab');
                var saveSymbolEl = $('<i>').addClass('fa fa-star');

                imageEl.attr('src', eventImg);
                imageEl.attr('alt', eventHeader);
                imageEl.css('width', '100%');
                cardLinkEl.attr('href', eventLink);
                cardLinkEl.attr('id', eventHeader);
                cardLinkEl.html('<h6>' + eventHeader + '</h6>');
                eventTimeEl.html('<p>' + newTime + '</p>');
                eventDateEl.html('<p>' + newDate + '</p>');
                saveEventBtnEl.attr('id', eventId);

                // var cardContainer = $("<div class=\"card mt-2 saveEventDiv\" style=\"width: 18rem;\"</div>");
                // cardContainer.append("<img src=" + eventImg + " class=\"card-img-top\" alt=" + eventHeader + "></img>");
                // var cardBody = $("<div class=\"card-body\">");
                // var cardLink = $("<a class=\"links\" href=" + eventLink + ">");
                // cardLink.append("<h5 class=\"card-title\" id=" + eventHeader + ">" + eventHeader + "</h5>");
                // cardBody.append(cardLink);
                // cardBody.append("<p class=\"card-text time\">" + newTime + "</p>");
                // cardBody.append("<p class=\"card-text date\">" + newDate + "</p>");
                // cardBody.append("<button class=\"btn btn-primary saveEvent\" id=" + eventId + "><i class=\"fa fa-star\"></i></button>");

                // id saveEvent for like buttons

                displayBoxEl.append(cardContainerEl);
                cardContainerEl.append(cardDivEl);
                cardDivEl.append(imageDivEl);
                imageDivEl.append(imageEl);
                imageDivEl.append(saveEventBtnEl);
                saveEventBtnEl.append(saveSymbolEl);
                cardDivEl.append(cardContentEl);

                cardContentEl.append(cardLinkEl);
                cardContentEl.append(eventTimeEl);
                cardContentEl.append(eventDateEl);


                var savedNameString = localStorage.getItem("events");
                savedNameJSON = JSON.parse(savedNameString) || [];

                var newInput = [{
                    "eventId": eventId,
                    "eventName": eventHeader,
                    "eventDate": eventDate,
                    "eventTime": eventTime,
                    "eventImg": eventImg,
                    "eventLink": eventLink
                }];

                savedNameJSON.push(newInput);
                localStorage.setItem("events", JSON.stringify(savedNameJSON));
            };
        }
    };

    function eventDisplayNumber() {
        // if there is no value in the 'number of events displayed' inputBox, then
        // array size will be 5 elements
        if ($("#numberSelector").val() == "") {
            var displayNumber = 20;
        }
        // if the above condition is not met, then the array size will be equivalent
        // to the number input by the user
        else {
            displayNumber = $("#numberSelector").val();
        }
        return displayNumber;
    }

    // button clicked to save event into favourite page
    // grab information from existing array and store into new array show in favourite page
    $(".displayEvents").on("click", ".saveEvent", saveEventToLocal);

    function saveEventToLocal() {

        var savedName = $(this).attr('id');
        console.log(savedName);
        var eventsList = JSON.parse(localStorage.getItem("events"));

        // create new array using the information in existing array
        var selectedString = localStorage.getItem("selected");
        selectedJSON = JSON.parse(selectedString) // || []; 

        if (selectedJSON == null) {

            var selectedJSON = [];
            for (var a = 0; a < eventsList.length; a++) {
                if (savedName == eventsList[a][0].eventId) {

                    var selectedInput = [{
                        "eventName": eventsList[a][0].eventName,
                        "eventDate": eventsList[a][0].eventDate,
                        "eventTime": eventsList[a][0].eventTime,
                        "eventImg": eventsList[a][0].eventImg,
                        "eventLink": eventsList[a][0].eventLink,
                        "eventId": eventsList[a][0].eventId
                    }]

                    selectedJSON.push(selectedInput);
                    localStorage.setItem("selected", JSON.stringify(selectedJSON));

                }
            }

        } else {
            // check if event has been stored in the new array
            // if event alreadd exist, it won't be double saved
            var checker = search(savedName, selectedJSON);
            console.log(checker);
            if (checker) {
                console.log("exist!");
            } else {
                for (var a = 0; a < eventsList.length; a++) {

                    if (savedName == eventsList[a][0].eventId) {

                        var selectedInput = [{
                            "eventName": eventsList[a][0].eventName,
                            "eventDate": eventsList[a][0].eventDate,
                            "eventTime": eventsList[a][0].eventTime,
                            "eventImg": eventsList[a][0].eventImg,
                            "eventLink": eventsList[a][0].eventLink,
                            "eventId": eventsList[a][0].eventId
                        }]

                        selectedJSON.push(selectedInput);
                        localStorage.setItem("selected", JSON.stringify(selectedJSON));
                    }
                }
            }
        }
    }

    //event checking function 
    function search(id, inputArray) {
        for (var m = 0; m < inputArray.length; m++) {
            if (inputArray[m][0].eventId === id) {
                return true;
            }
        }
    }
});

// search results has a "like" button to add them into favourite page
// on click these "like" buttons can add them to local storage
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