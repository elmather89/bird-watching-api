$(document).ready(function () {

  jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });

  /**
   * 
   * Psuedo code
   */
  // doc on ready
  // global vars
  // cors fix func
  // $.when func that waits for async funcs to resolve
  // $.ajax func to pass vars thru

  let constructedBirdArr = [];
  let tempEbirdEndpoint = '';
  let tempFlickrEndpoint = '';


  navigator.geolocation.getCurrentPosition(function (position) {

    var geoLat = position.coords.latitude;
    var geoLon = position.coords.longitude;

    // $.when func that waits for the 2 query-concat funcs to resolve before 
    // creating all the DOM elements with the returned values?
    $.when(createHotSpotQuery(geoLat, geoLon), createFlickrQuery(constructedBirdArr), birdAjax(tempEbirdEndpoint), birdAjax(tempFlickrEndpoint))
      .then(function (res1, res2, res3, res4) {
        console.log('All functions resolved!');
      });

    // create query that will get all the birds observed near you
    // ebird api
    function createHotSpotQuery(geoLat, geoLon) {
      var lat = `${geoLat}`;
      var lon = `${geoLon}`;

      var hotspotQuery = "https://ebird.org/ws2.0/data/obs/geo/recent?lat=" + lat + "&lng=" + lon + "&key=56oflln2kieu";

      tempEbirdEndpoint.concat(hotspotQuery);
      console.log('eBirdEndpoint created...');
    };

    // create query that will concat the query string needed to send to 
    // the flickr api
    createFlickrQuery(constructedBirdArr);
    function createFlickrQuery(constructedBirdArr) {
      if (tempEbirdEndpoint) {
        console.log('Got the eBirdEndpoint! ' + `${tempEbirdEndpoint}`);

        // concat with passed vars
        // need the bird's name off the constructedBirdArr arr
        // ex: constructedBirdArr.comName
        constructedBirdArr.forEach(bird => {
          let name = bird.comName;
          let locId = bird.locId;
          let locName = bird.locName;

          console.log('createFlickrQuery funcs forEach hit...');

        });
      } else {
        console.log('Waiting on eBirdEndpoint to be constructed...');
      };
      // .then send thru $.ajax func ?
    };

    // $.ajax query to send queries thru
    function birdAjax(apiCall) {
      return $.ajax({
        url: apiCall,
        method: 'GET',
        success: function () {
          console.log('API call worked!');
        },
        error: function (data) {
          console.error('API call failed...');
        },
      });
    }

  });

});