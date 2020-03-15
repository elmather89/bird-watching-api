$(document).ready(function () {

    navigator.geolocation.getCurrentPosition(function (position) {
        // vars to hold coordinates data
        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;
        console.log(geoLat, geoLon);

        // cors issue
        jQuery.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        var getBirdsAtYourLocation = (newLoc, newLocName) => {

            var yourLoc = newLoc;
            var nearbyBirds = [];

            yourLoc.forEach(location => {
                // locId L1150539
                // locId L4796501 <-------- KCK
                
                // plug user's unique locId into ajax call for birds...
                // found in that area.
                var queryURL = "https://ebird.org/ws2.0/data/obs/" + location + "/recent?key=56oflln2kieu";
                console.log(queryURL);

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (birds) {
                    console.log(birds);

                    // nearbyBirds.push(birds);

                    // var birdBtns = $("<button>");
                    // birdBtns.text('hello bird');
                    // // birdBtns.attr({ "data-bird": response[i].comName, "data-target": "modal" + [i] });
                    // $("#birds-here").append(birdBtns);

                });
            });

        };

        // bird api
        var searchForBirds = function (lat, lon) {

            var lat = `${lat}`;
            var lon = `${lon}`;
            var newLoc = [];
            var newLocName = [];
            var flockSize = [];
            var locationName = [];
            var privateLoc = [];
            var obsDate = [];

            // console.log(newLoc);
            // console.log(nearbyBirds);
            // console.log(flockSize);
            // console.log(locationName);
            // console.log(privateLoc);
            // console.log(obsDate);
            // console.log(locationId);
            // console.log(lat, lon, newLoc);

            // locId L1150539
            // var queryURL = "https://ebird.org/ws2.0/data/obs/L1150539/recent?key=56oflln2kieu";
            var queryURL = "https://ebird.org/ws2.0/ref/hotspot/geo?lat=" + lat + "&lng=" + lon + "&fmt=json&key=56oflln2kieu";
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (data) {
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    var locationId = data[i].locId;
                    var locationName = data[i].locName;
                    // console.log(data[i].locName);
                };

                newLoc.push(locationId);
                newLocName.push(locationName);
                // console.log(locationId);
            }).then(function () {
                // console.log(newLocName);

                getBirdsAtYourLocation(newLoc, newLocName);

                // $.ajax({
                //     url: queryURL,
                //     method: "GET"
                // }).then(function () {

                //     // showArr(newLoc);

                //     // flickr api key to connect photos of birds
                //     // key = ade9a6668e30d057f1126bc24e620115
                //     // https://api.flickr.com/services/rest/?method=flickr.test.echo&name=value
                //     //...

                //     // for (var i = 0; i < response.length; i++) {
                //     //     // console.log(response[i].comName);
                //     //     var birdList = response[i].comName;

                //     //     nearbyBirds.push(response[i].comName);
                //     //     flockSize.push(response[i].howMany);
                //     //     locationName.push(response[i].locName);
                //     //     privateLoc.push(response[i].locationPrivate);
                //     //     obsDate.push(response[i].obsDt);

                //     //     var birdBtns = $("<button>");
                //     //     birdBtns.text(flockSize[i] + " " + nearbyBirds[i] + " near " + locationName[i] + ".");
                //     //     birdBtns.attr({"data-bird": response[i].comName, "data-target": "modal" + [i]});
                //     //     $("#birds-here").append(birdBtns);
                //     // };
                // });
            });
        };
        searchForBirds(geoLat, geoLon);

    });

});