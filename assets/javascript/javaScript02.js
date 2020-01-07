$(document).ready(function () {

    // $('.carousel').carousel({
    //     indicators: true
    // });

    // setInterval(function(){
    //     $('.carousel').carousel('next');
    // }, 2000);

    var currentTime = $("#currentTime");
    currentTime.text(moment().format('lll'));
    // TicketMaster
    // var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap"
    // backup
    var apiKey = "93sIViJs6exJuIwcNtKqMSGIAdp1eJV9"
    var checker = false;
    var deviceLat = "";
    var deviceLon = "";

    // get current device location
    getDeviceLoc();

    // get current device location function
    function getDeviceLoc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSucc, showError);
        };
        function geoSucc(position) {
            var deviceLat = position.coords.latitude;
            var deviceLon = position.coords.longitude;
            grabResponse(deviceLat,deviceLon);
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
    function grabResponse(latitude,longitude) {

        // country set as AU changed by using geolocation
        // var country = "&countryCode=AU";

        var responseNumber = "&size=100"; //response size
        // response of the location of current device
        if (latitude == "" && longitude == "") {
            var geoSearch = ""; //response size
        } else {
            geoSearch = "&latlong=" + latitude + "," + longitude;
        };
        // API from ticketmaster
        console.log(geoSearch);

        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + geoSearch + responseNumber + "&apikey=" + apiKey;
        console.log(queryURL);
        // parse response from ticketmaster and enter displayEvent function
        $.ajax({
            type: 'GET',
            url: queryURL,
            dataType: 'JSON',
            success: function (response) {
                console.log(response);
                displayUpcomingEvents(response);
            },
            error: function () {
                alert("Error, 404 (not found)!")
            }
        });
    };

    // display search response for home page
    function displayUpcomingEvents(response) {
        console.log(response);
        //loop through search response to display them
        var eventExist = response._embedded;
        console.log(eventExist);
        if (eventExist == null) {
            alert('Error, no response received!')
        }
        else {
            var eventArray = response._embedded.events.length;
            console.log(eventArray);
            for (var i = 0; i < eventArray; i++) {
                // parse from json for the needed data
                var eventEl = response._embedded.events[i];
                var eventDate = eventEl.dates.start.localDate;
                var newDate = moment(eventDate).format("MMMM Do YYYY");
                var eventTime = eventEl.dates.start.localTime;
                var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a");
                var eventImg = eventEl.images[0].url;
                var eventHeader = eventEl.name;
                var eventLink = eventEl.url;
                var eventId = eventEl.id;
                // display in display area using card 
                var carouselDisplayEl = $('.carousel');
                var carouselContainerEl = $('<a>').addClass('carousel-item');
                // var cardDivEl = $('<div>').addClass('card saveEventDiv');
                var imageDivEl = $('<div>').addClass('card-image');
                var imageEl = $('<img>');
                var eventLinkEl = $('<a>').addClass('links card-title');
                // var cardContentEl = $('<div>').addClass('card-content');
                var eventTimeEl = $('<p>').addClass('time');
                var eventDateEl = $('<p>').addClass('date');
                // var saveEventBtnEl = $('<a>').addClass('waves-effect waves-light btn-floating saveEvent halfway-fab');
                // var saveSymbolEl = $('<i>').addClass('fa fa-star');

                carouselContainerEl.attr('href', '#'+ i +'!' );
                imageEl.attr('src', eventImg);
                imageEl.attr('alt', '');
                imageEl.css('width', '100%');
                eventLinkEl.attr('href', eventLink);
                eventLinkEl.attr('id', eventHeader);
                eventLinkEl.html('<h6>' + eventHeader + '</h6>');
                eventTimeEl.html('<p>' + newTime + '</p>');
                eventDateEl.html('<p>' + newDate + '</p>');
                // saveEventBtnEl.attr('id', eventId);

                carouselDisplayEl.append(carouselContainerEl);
                carouselContainerEl.append(imageDivEl);
                imageDivEl.append(imageEl);
                imageDivEl.append(eventLinkEl);
                imageDivEl.append(eventTimeEl);
                imageDivEl.append(eventDateEl);

                $('.carousel').carousel({
                    indicators: false
                });
            
                setInterval(function(){
                    $('.carousel').carousel('next');
                }, 1000);
            };
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