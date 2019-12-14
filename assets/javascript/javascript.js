$(document).ready(function () {
    var apiKey = "prBtwnYW6qBfgHYfb8kiUfLXT4bAjXap" //TicketMaster
    var checker = false;

    $("#searchbtn").on("click", function () {
        event.preventDefault();
        console.log('searchbeenclicked');
        var searchInput = $("#searchInput").val(); //keyword
        console.log(searchInput);


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
        if ($("#numberSeletor").val() == null) {
            var responseNumber = "&size=5"; //response size
        } else {
            var responseNumber = "&size=" + $("#numberSeletor").val();
        }


        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchInput + responseNumber + "&apikey=" + apiKey;
        console.log(responseNumber);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            displayEvents(response);
        });
    })


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

