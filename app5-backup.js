$(document).ready(function () {
    var allBirds = [{
        'name': '',
        'locId': '',
        'locName': '',
        // 'imgSrc': '',
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

    /**
 * 
 * 
 * 
 * 
 */

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    /**
     * 
     * 
     * 
     * 
     */

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

            fetch(hotspotQuery).then(function (response) {
                // console.log(response);
                // if (response.ok) {
                //     return response.json();
                // } else {
                //     return Promise.reject(response);
                // }
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
                        // 'imgSrc': '',
                        'flickrQuery': birdImgQuery,
                    });

                    for (const property in allBirds) {
                        console.log(allBirds);
                        // console.log(allBirds[property].flickrQuery);
                        let query = `${allBirds[property].flickrQuery}`;

                        fetch("https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f0b22c0a4fdf472d7c1175a6438910e4&tags=" + query + "&format=json&nojsoncallback=1", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                // console.log(result.photos.photo[0]);
                                let birdPhoto = result.photos.photo[0];
                                console.log(birdPhoto);

                                // allBirds.imgSrc = `${birdPhoto}`;
                            })
                            .catch(error => console.log('error', error));
                    };

                    // console.log('\n\n\n\n\n');
                    // console.log(allBirds);
                    // console.log('\n\n\n\n\n');

                });

            });

        };
        getBirdSightingsNearby(geoLat, geoLon);

    });

    console.log('hello');

});