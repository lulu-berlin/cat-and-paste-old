module.exports = (function() {
    'use strict';

    var Ajax = require('ajax');

    function callGiphy(endpoint, params, callback) {
        params.api_key = 'dc6zaTOxFJmzC';
        Ajax.getJSON(
            'http://api.giphy.com/v1/gifs/' + endpoint + '?' + Ajax.param(params),
            callback);
    }

    function randomGiphy(searchTerm, callback) {
        callGiphy('random', {
            tag: searchTerm
        }, callback);
    }

    function giphyByID(id, callback) {
        callGiphy(id, {}, callback);
    }

    function getMP4(searchTerm, callback) {
        randomGiphy(searchTerm, function(result) {
            giphyByID(result.data.id, function(result) {
                callback(result.data.images.fixed_height.mp4);
            });
        });
    }

    function getGIF(searchTerm, callback) {
        randomGiphy(searchTerm, function(result) {
            giphyByID(result.data.id, function(result) {
                callback(result.data.images.fixed_height.url);
            });
        });
    }

    return {
        getMP4: getMP4,
        getGIF: getGIF
    };
})();
