$(document).ready(function () {

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    navigator.geolocation.getCurrentPosition(function (position) {
        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;
        var constructedBirdArr = [];
        var tempQuery = [];

        nearbyHotSpotsFunc(geoLat, geoLon, constructedBirdArr, tempQuery);
        function nearbyHotSpotsFunc(geoLat, geoLon, constructedBirdArr, tempQuery) {
            var lat = `${geoLat}`;
            var lon = `${geoLon}`;
            var requestedBird = [constructedBirdArr];
            var holdQuery = [tempQuery];
            var hotspotQuery = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + lat + "&lng=" + lon + "&key=56oflln2kieu";

            $.ajax({
                url: hotspotQuery,
                method: 'GET',
                success: function (data) {
                    // console.log(data);

                    // loop thru this data
                    data.forEach(bird => {
                        // console.log(bird);
                        let name = bird.comName;
                        let locId = bird.locId;
                        let locName = bird.locName;

                        // construct a flickr api query using this data
                        let birdImgQuery = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ade9a6668e30d057f1126bc24e620115&tags=' + `${name}` + '&format=json';

                        // push constructed api param to a new var (?)
                        constructedBirdArr.push({
                            'name': name,
                            'locId': locId,
                            'locName': locName,
                            'imgSrc': '',
                            'initFlickrQuery': birdImgQuery,
                        });
                    });
                },
            }).then(function (res) {
                // console.log(res);
                console.log(constructedBirdArr);

                res.forEach(bird => {

                    let name = bird.comName;
                    let locID = bird.locId;
                    let locName = bird.locName;
                    /**
                     * dom code 
                     */
                    let birdCard = $('<div>');
                    let cardBody = $('<div>');
                    let cardTitle = $('<h1>');
                    let cardPara = $('<p>');
                    let cardImg = $('<img>');
                    let tempSrcUrl = 'https://farm66.staticflickr.com/65535/49659533952_60d03a8874.jpg';

                    cardTitle.text(name);
                    cardPara.text(locName + ', ' + locID);

                    birdCard.attr({ 'class': 'card bird-card' });
                    cardBody.attr({ 'class': 'card-body' });
                    cardTitle.attr({ 'class': 'card-title' });
                    cardImg.attr({ 'class': 'card-img', 'src': tempSrcUrl });

                    birdCard.append(cardBody);
                    cardBody.append(cardTitle);
                    cardTitle.append(cardPara);
                    cardPara.append(cardImg);

                    $('#birds-here').append(birdCard);
                    // console.log(queryThis);
                    /**
                     * end dom code
                     */

                    var image = document.getElementsByClassName('card-img');
                    new simpleParallax(image, {
                        orientation: 'left right',
                        overflow: false,
                        transition: 'cubic-bezier(0,0,0,1)',
                        delay: 2,
                    });
                });

                var response = res;

                // queryThis();
                function queryThis() {
                    constructedBirdArr.forEach(element => {
                        // console.log(element);
                        let holder = element.initFlickrQuery;
                        let name = element.comName;
                        let locId = element.locId;
                        let locName = element.locName;
                        let initFlickrQuery = element.initFlickrQuery;

                        constructedBirdArr = [];

                        constructedBirdArr.push({
                            'name': name,
                            'locId': locId,
                            'locName': locName,
                            'imgSrc': '',
                            'initFlickrQuery': initFlickrQuery,
                        });

                        ajaxFunc(holder);
                    });
                };

                function ajaxFunc(holder) {
                    console.log(holder);

                    $.ajax({
                        url: `${holder}`,
                        method: 'GET',
                        success: function (res) {
                            console.log(res);

                            // let name = res.name;
                            // let locId = res.locId;
                            // let locName = res.locName;
                        },
                        error: function (res) {
                            return;
                        }
                    });
                }
            });
        };
    });
});