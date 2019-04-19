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
            var nearbyBirds = [];

            console.log(nearbyBirds);
            console.log(newLoc);
            // console.log(locationId);
            // console.log(lat, lon, newLoc);

            // locId L1150539
            // var queryURL = "https://ebird.org/ws2.0/data/obs/L1150539/recent?key=56oflln2kieu";
            var queryURL = "https://ebird.org/ws2.0/ref/hotspot/geo?lat=" + lat + "&lng=" + lon + "&fmt=json&key=56oflln2kieu";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (data) {
                // console.log(data);

                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].locId);
                    var locationId = data[i].locId;
                }

                newLoc.push(locationId);
                // console.log(locationId);
            }).then(function(data) {
                // plug user's unique locId into ajax call for birds...
                // found in that area.

                // locId L1150539
                var queryURL = "https://ebird.org/ws2.0/data/obs/L1150539/recent?key=56oflln2kieu";
                // console.log(queryURL);

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) {
                    // console.log(response);

                    for (var i = 0; i < response.length; i++) {
                        console.log(response[i].comName);
                        var birdList = response[i].comName;
                    }

                    nearbyBirds.push(birdList);
                });
            });
        };
        searchForBirds(geoLat, geoLon);
    });

});