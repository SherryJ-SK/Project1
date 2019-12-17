
$(document).ready(function () {
    $(document).foundation();
    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster

    $("#searchBtn").on("click", function () {
        console.log('search buttn clicked');
        event.preventDefault();
        var searchInput = $(".event_search").val(); //keyword

        var country = "&countryCode=AU"; //country
        if ($(".event_search").val() == null) {
            var classificaiton = "&classificationName=sports" //classification
        } else {
            var classificaiton = "&classificationName=" + $(".event_search").val();
        }

        var startDate = "&localStartDateTime=2019-12-01T01:00:00"; //date
        var endDate = "&localStartEndDateTime=2020-08-01T24:00:00";
        //"Query param: localStartEndDateTime - Range must be of a valid format.  
        //use * to designate an unbounded value. 
        //{example: range less then *,2020-08-01T14:00:00 greater: 2020-08-01T14:00:00,* between: 2020-07-08T14:00:00,2020-08-01T14:00:00}"
        if ($(".responseNumber").val() == null) {
            var responseNumber = "&size=20"; //response size
        } else {
            var responseNumber = "&size=" + $(".responseNumber").val();
        }
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchInput + country + classificaiton + responseNumber + "&apikey=" + apiKey;
        console.log(responseNumber);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            displayEvents(response);
        });
    })

    function displayEvents(response) {
        for (var i = 0; i < 20; i++) {

            var eventDate = response._embedded.events[i].dates.start.dateTime;
            var eventInfo = $(".displayEvents");
            var eventDateEl = $("<div>").addClass("eventinfo");
            console.log(response);
            eventDateEl.text(eventDate);
            eventInfo.append(eventDateEl);

        }

    }


});

