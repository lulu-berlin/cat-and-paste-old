(function() {
    'use strict';

    var searchTerm = 'cats';
    var cacheSize = 5;

    window.onload = function() {
        // remove static cat image
        var staticCat = document.getElementById('static-cat');
        staticCat.src =
            'http://loremflickr.com/' + Math.floor(window.innerWidth / 4) +
            '/' + Math.floor(window.innerHeight / 4) + '/cat';

        var Modernizr = require('modernizr');

        if (Modernizr.video) {
            Modernizr.on('videoautoplay',
                function(videoautoplay) {
                    if (videoautoplay) {
                        // if (false) {
                        if (Modernizr.video.h264) {
                            var MP4Cats = require('mp4-cats');

                            MP4Cats(searchTerm, cacheSize);
                        } else {
                            console.log('Not implemented');
                        }
                    }
                });
        } else {
            console.log('Not implemented');
        }
    };
})();
