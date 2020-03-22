$(document).ready(function () {

    /**
     * get user location
     */
    navigator.geolocation.getCurrentPosition(function (position) {

        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;
        const reqBirdArr = [];
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

        function domManipulation(sweetBird) {
            // console.log(sweetBird);
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
         * ebird api call
         */
        nearbyHotSpotsFunc(geoLat, geoLon, reqBirdArr);
        function nearbyHotSpotsFunc(geoLat, geoLon, requestedBird) {
            // console.log(reqBird);
            var lat = `${geoLat}`;
            var lon = `${geoLon}`;
            // var reqBird = birdImageUrlArr;
            // var imgSrcUrl = `${imgSrcUrl}`;

            // Nearby hotspost query
            var hotspotQuery = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + lat + "&lng=" + lon + "&key=56oflln2kieu";
            // console.log(hotspotQuery);

            $.ajax({
                url: hotspotQuery,
                method: "GET",
                success: function (data) {
                    // console.log(data);

                    data.forEach(bird => {
                        /**
                         * flickr api call
                         */
                        const getImagesFunc = (bird) => {
                            const birdArr = [bird];
                            // const birdImageUrlArr = [];
                            // console.log(birdImageUrlArr);

                            birdArr.map(sweetBird => {
                                // console.log(sweetBird);

                                const sweetBirdName = sweetBird.comName;
                                const trimName = sweetBirdName.trim();
                                const replaceSpace = trimName.replace(' ', '+');
                                const obsLocID = sweetBird.locId;
                                const obsLocName = sweetBird.locName;
                                /**
                                 * Example of working url: https://farm66.staticflickr.com/65535/49659533952_60d03a8874.jpg
                                 */
                                var birdImgQuery = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ade9a6668e30d057f1126bc24e620115&tags=' + `${replaceSpace}` + '&format=json';

                                reqBirdArr.push({
                                    'name': replaceSpace,
                                    'imgSrc': birdImgQuery,
                                    'locationID': obsLocID,
                                    'locationName': obsLocName,
                                });
                                // domManipulation(sweetBird);
                            });
                        };
                        // getImagesFunc(bird);
                    });

                    mapOverNew(data);
                    function mapOverNew(data) {
                        console.log('hello');

                        data.map(item => {
                            console.log(item);
                            const newUrl = item.imgSrc;
                            
                            $.ajax({
                                url: newUrl,
                                method: "GET",
                                success: function(data) {
                                    console.log(data);
                                },
                            });

                        });

                    };
                },
            });

        };
        // nearbyHotSpotsFunc(geoLat, geoLon, reqBird, imgSrcUrl);
    });

});