$(document).ready(function () {
    var allBirds = [{
        'name': '',
        'locId': '',
        'locName': '',
        'imgSrc': '',
        'flickrQuery': '',
    }];

    for (const property in allBirds) {
        console.log(allBirds[property]);
    };

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    navigator.geolocation.getCurrentPosition(function (position) {
        var geoLat = position.coords.latitude;
        var geoLon = position.coords.longitude;

        var getBirdSightingsNearby = (geoLat, geoLon) => {
            var lat = `${geoLat}`;
            var lon = `${geoLon}`;
            var hotspotQuery = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + lat + "&lng=" + lon + "&key=56oflln2kieu";
            // var allBirds = [];
            var finalBirds = [];
            var finalFlickrQuery = '';

            fetch(hotspotQuery, requestOptions).then(function (response) {
                return response.json();

            }).then(function (data) {
                // console.log(data);

                data.forEach(bird => {
                    let birdImgQuery = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ade9a6668e30d057f1126bc24e620115&tags=' + `${bird.comName}` + '&format=json&nojsoncallback=1';
                    // Store the post data to a variable
                    allBirds.push({
                        'name': bird.comName,
                        'locId': bird.locId,
                        'locName': bird.locName,
                        'imgSrc': '',
                        'flickrQuery': birdImgQuery,
                    });
                });

                for (const property in allBirds) {
                    // console.log(allBirds);
                    // console.log(allBirds[property].flickrQuery);
                    let query = `${allBirds[property].flickrQuery}`;

                    fetch("https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f0b22c0a4fdf472d7c1175a6438910e4&tags=" + query + "&format=json&nojsoncallback=1", requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            // console.log(result.photos.photo[0]);
                            
                            // let birdPhoto = result.photos.photo[0];
                            let birdPhoto = result.photos.photo[Math.floor(Math.random() * result.photos.photo.length)];
                            // console.log(birdPhoto.farm);
                            // console.log(birdPhoto);

                            if (birdPhoto) {
                                let farmId = birdPhoto.farm;
                                let serverId = birdPhoto.server;
                                let photoId = birdPhoto.id;
                                let secret = birdPhoto.secret;
                                let photoTitle = birdPhoto.title;
                                let photographerId = birdPhoto.owner;

                                /**
                                 * The URL takes the following format:
                                 * https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
                                 */
                                let birdPhotoSrc = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_' + secret + '.jpg';

                                allBirds[property].imgSrc = birdPhotoSrc;
                            } else {
                                let placeholder = 'https://thegraphicsfairy.com/wp-content/uploads/blogger/-4IrilT9j6LU/TgdIn4XyNwI/AAAAAAAANHI/tQVofLFzDeI/s400/birds%2Btree%2Bvintage%2Bgraphicsfairy004b.jpg';

                                allBirds[property].imgSrc = `${placeholder}`;
                            };

                            /**
                            * dom code 
                            */
                            let birdCard = $('<div>');
                            let cardBody = $('<div>');
                            let cardTitle = $('<h1>');
                            let cardPara = $('<p>');
                            let cardImgWrapper = $('<div>');
                            let cardImg = $('<img>');

                            cardTitle.text(allBirds[property].name);
                            cardPara.text(allBirds[property].locName + ', ' + allBirds[property].locId);

                            birdCard.attr({ 'class': 'card bird-card' });
                            cardBody.attr({ 'class': 'card-body' });
                            cardTitle.attr({ 'class': 'card-title' });
                            cardImg.attr({ 'class': 'img-fluid', 'src': `${allBirds[property].imgSrc}` });
                            cardImgWrapper.attr({ 'class': 'card-img' });

                            birdCard.append(cardBody);
                            cardBody.append(cardTitle);
                            cardTitle.append(cardPara);
                            cardPara.append(cardImgWrapper);
                            cardImgWrapper.append(cardImg);

                            $('#birds-here').append(birdCard);
                            // console.log(queryThis);
                            /**
                             * end dom code
                             */

                        })
                        .catch(error => console.log('error', error));
                };

                console.log('\n\n\n\n\n');
                console.log(allBirds);
                console.log('\n\n\n\n\n');

            });

        };
        getBirdSightingsNearby(geoLat, geoLon);

    });

    console.log('hello');

});