$(document).ready(function () {

    navigator.geolocation.getCurrentPosition(function (position) {
        // vars to hold coordinates data
        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;
        // console.log(geoLat, geoLon);

        // cors issue
        jQuery.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        // bird api
        var searchForBirds = function (lat, lon, newLoc) {
            var lat = `${lat}`;
            var lon = `${lon}`;
            var newLoc = [];
            // console.log(newLoc);
            // console.log(locationId);
            console.log(lat, lon, newLoc);

            // var queryURL = "https://ebird.org/ws2.0/data/obs/L4796501/recent?key=56oflln2kieu";
            var queryURL = "https://ebird.org/ws2.0/ref/hotspot/geo?lat=" + lat + "&lng=" + lon + "&fmt=json&key=56oflln2kieu";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (data) {
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].locId);
                    var locationId = data[i].locId;
                }
                newLoc.push(locationId);
                // console.log(newLoc);
            }).then(function(locationId) {
                // console.log(locationId);

                var queryURL = "https://ebird.org/ws2.0/data/obs/" + newLoc + "/recent?key=56oflln2kieu";
                console.log(queryURL);

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(data) {
                    console.log(data);
                    var birdsNearby = [];
                    var howMany = [];
                    // console.log(birdsNearby);

                    birdsNearby.push(data.comName);
                })
            })
        };
        searchForBirds(geoLat, geoLon);
    });

});