$(document).ready(function() {
    $('.sidenav').sidenav();

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
            deviceLat = position.coords.latitude;
            deviceLon = position.coords.longitude;
            grabResponse();
        };

        function showError(error) {
            grabResponse();
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
        // country set as AU changed by using geolocation
        // var country = "&countryCode=AU";

        var responseNumber = "&size=100"; //response size
        // response of the location of current device
        if (deviceLat == "" && deviceLon == "") {
            var geoSearch = ""; //response size
        } else {
            var geoSearch = "&latlong=" + deviceLat + "," + deviceLon;
        };
        // API from ticketmaster

        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + geoSearch + responseNumber + "&apikey=" + apiKey;
        // parse response from ticketmaster and enter displayEvent function
        $.ajax({
            type: 'GET',
            url: queryURL,
            dataType: 'JSON',
            success: function(response) {
                displayUpcomingEvents(response);
            },
            error: function() {
                alert("Error, 404 (not found)!")
            }
        });
    };

    // display search response for home page
    function displayUpcomingEvents(response) {
        //loop through search response to display them
        var eventArray = response._embedded.events.length;
        for (var i = 0; i < eventArray / 5; i++) {
            // parse from json for the needed data
            var eventEl = response._embedded.events[i * 5];
            var eventDate = eventEl.dates.start.localDate;
            var newDate = moment(eventDate).format("MMMM Do YYYY");
            var eventTime = eventEl.dates.start.localTime;
            var newTime = moment(eventTime, "HH:mm:ss").format("h:mm a");
            var eventImg = eventEl.images[1].url;
            var eventHeader = eventEl.name;
            var eventLink = eventEl.url;
            var eventId = eventEl.id;
            // display in display area using card 
            var carouselDisplayEl = $('.carousel');
            var carouselContainerEl = $('<a>').addClass('carousel-item');
            // var cardDivEl = $('<div>').addClass('card saveEventDiv');
            // var imageDivEl = $('<div>').addClass('card-image');
            var imageEl = $('<img>');
            var eventLinkEl = $('<a>').addClass('links card-title col s12 m12 l12');
            // var cardContentEl = $('<div>').addClass('card-content');
            var eventTimeEl = $('<p>').addClass('time col s12 m12 l12');
            var eventDateEl = $('<p>').addClass('date col s12 m12 l12');
            // var saveEventBtnEl = $('<a>').addClass('waves-effect waves-light btn-floating saveEvent halfway-fab');
            // var saveSymbolEl = $('<i>').addClass('fa fa-star');

            carouselContainerEl.attr('href', '#' + i + '!');
            imageEl.attr('src', eventImg);
            imageEl.attr('alt', eventHeader);
            imageEl.css('width', '100%');
            eventLinkEl.attr('href', eventLink);
            eventLinkEl.attr('id', eventHeader);
            eventLinkEl.html('<h6>' + eventHeader + '</h6>');
            eventTimeEl.html('<p>' + newTime + '</p>');
            eventDateEl.html('<p>' + newDate + '</p>');
            eventLinkEl.css({ 'position': 'absolute', 'top': '0', 'left': '10px', 'color': '#ffffff' });
            eventTimeEl.css({ 'position': 'absolute', 'top': '60px', 'left': '10px' });
            eventDateEl.css({ 'position': 'absolute', 'top': '80px', 'left': '10px' });
            // saveEventBtnEl.attr('id', eventId);

            carouselDisplayEl.append(carouselContainerEl);
            carouselContainerEl.append(imageEl);
            // imageDivEl.append(imageEl);
            carouselContainerEl.append(eventLinkEl);
            carouselContainerEl.append(eventTimeEl);
            carouselContainerEl.append(eventDateEl);

            $('.carousel').carousel({
                indicators: false
            });

            setInterval(function() {
                $('.carousel').carousel('next');
            }, 2000);
        };

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