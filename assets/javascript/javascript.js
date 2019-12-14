$(document).ready(function() {
    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster
    var checker = false;

    $("#searchbtn").on("click", function() {
        event.preventDefault();
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
        }).then(function(response) {
            console.log(response);
            displayEvents(response);
        });
    };




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


    function displayEvents(response) {
        for (var i = 0; i < 20; i++) {
            var eventEl = response._embedded.events[i];
            var eventDate = eventEl.dates.start.localDate;
            var eventTime = eventEl.dates.start.localTime;
            var eventImg = eventEl.images[0].url;
            var eventHeader = eventEl.name;
            var eventLink = eventEl.url;
            var displayBox = $(".displayEvents");
            var cardContainer = $("<div class=\"card\" style=\"width: 18rem;\">");
            cardContainer.append("<img src=" + eventImg + " class=\"card-img-top\" alt=" + eventHeader + "></img>");
            var cardBody = $("<div class=\"card-body\">");
            var cardLink = $("<a href=" + eventLink + ">");
            cardLink.append("<h5 class=\"card-title\">" + eventHeader + "</h5>");
            cardBody.append(cardLink);
            cardBody.append("<p class=\"card-text\">" + eventDate + " " + eventTime + "</p>");
            cardBody.append("<a class=\"btn btn-primary\" id = \"saveEvent\">Add to favourite</a>"); //id saveEvent for like buttons

            cardContainer.append(cardBody);
            displayBox.append(cardContainer);

        };

    };


});