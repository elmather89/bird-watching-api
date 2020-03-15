$(document).ready(function () {

    /**
     * get user location
     */
    navigator.geolocation.getCurrentPosition(function (position) {

        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;
        const birdImageUrlArr = [];
        // var reqBird = ['Northern Cardinal'];
        // var imgSrcUrl = 'https://farm66.staticflickr.com/65535/49659533952_60d03a8874.jpg';

        /**
         * fix cors issue
         */
        jQuery.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        function ajaxCall(sweetBird) {
            console.log(sweetBird);
            sweetBird['imgSrc'] = 'https://farm66.staticflickr.com/65535/49659533952_60d03a8874.jpg';

            /**
                     * Does the jquery dom manipulation stuff need to go here??
                     * IDK
                     */
            var birdCards = $('<div>');
            var cardBody = $('<div>');
            var cardTitle = $('<h5>');
            var birdImg = $('<img>');

            cardBody.attr({ 'class': 'card-body' });
            cardTitle.attr({ 'class': 'card-title' });
            birdCards.attr({ 'class': 'card bird-card' });
            birdImg.attr({ 'class': 'bird-img', 'src': sweetBird.imgSrc });

            cardBody.text(sweetBird.locId + ', ' + sweetBird.locName + ', ' + sweetBird.obsDt);
            cardTitle.text(sweetBird.comName);

            cardBody.prepend(cardTitle);
            birdCards.append(cardBody);
            cardBody.append(birdImg);
            $('#birds-here').append(birdCards);
        };

        /**
             * ajax call to get imgs for all birdImgQuery urls
             */
        function parseUrlArr(url) {
            // console.log(url);

            url.map(src => {
                // console.log(src);
                ajaxCall(src);
            });
        };

        /**
         * flickr api call
         */
        const getImagesFunc = (bird) => {
            const birdArr = [bird];
            // const birdImageUrlArr = [];
            // console.log(birdImageUrlArr);


            sweeterBirdArray(birdArr);
            function sweeterBirdArray(birdArr) {
                // console.log(birdArr);
                birdArr.map(sweetBird => {
                    // console.log(sweetBird);
                    const sweetBirdName = sweetBird.comName;
                    const trimName = sweetBirdName.trim();
                    const replaceSpace = trimName.replace(' ', '+');
                    /**
                     * Example of working url: https://farm66.staticflickr.com/65535/49659533952_60d03a8874.jpg
                     */
                    var birdImgQuery = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ade9a6668e30d057f1126bc24e620115&tags=' + `${replaceSpace}` + '&format=json';

                    sweetBird['imgSrc'] = birdImgQuery;
                    console.log(sweetBird);

                    ajaxCall(sweetBird);
                });
            };
        };
        // getImagesFunc();

        /**
         * ebird api call
         */
        nearbyHotSpotsFunc(geoLat, geoLon, birdImageUrlArr);
        function nearbyHotSpotsFunc(geoLat, geoLon) {
            // console.log(reqBird);
            var lat = `${geoLat}`;
            var lon = `${geoLon}`;
            var reqBird = birdImageUrlArr;
            // var imgSrcUrl = `${imgSrcUrl}`;

            // Nearby hotspost query
            var hotspotQuery = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + lat + "&lng=" + lon + "&key=56oflln2kieu";
            // console.log(hotspotQuery);

            $.ajax({
                url: hotspotQuery,
                method: "GET"
            }).then(function (data) {
                // console.log(data);

                data.forEach(bird => {
                    getImagesFunc(bird);
                });

            });

        };
        // nearbyHotSpotsFunc(geoLat, geoLon, reqBird, imgSrcUrl);
    });

});