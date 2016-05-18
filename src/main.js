(function() {
    'use strict';

    var Modernizr = require('modernizr');
    var SuperGif = require('supergif');
    var Giphy = require('giphy');

    var giphy_search_term = 'cats';
    var cache_size = 5;
    var cats = [];

    function startVideo(giphy) {
        for (var i = 0; i < cache_size; i++) {
            cats[i].element = document.getElementById('cat' + i);
        }

        var cur_cat = -1;

        function play() {
            if (cur_cat === -1) {
                var available_cat =
                    cats.find(function(cat) {
                        return cat.loaded;
                    });

                if (available_cat) {
                    cur_cat = cats.indexOf(available_cat);
                    available_cat.element.play();
                    available_cat.element.style.display = 'block';
                    available_cat.element.onended = function() {
                        if (cur_cat !== -1) {
                            switch_cat(cur_cat);
                        }
                    };
                } else {
                    setInterval(play, 100);
                }
            }
        }

        function switch_cat(i) {
            cats[i].element.style.display = 'none';
            cats[i].loaded = false;
            cur_cat = -1;

            giphy(function(url) {
                cats[i].element.src = url;
                cats[i].element.load();
                cats[i].element.oncanplaythrough = function() {
                    cats[i].loaded = true;
                };
                cats[i].element.onclick = play;
            });
            play();
        }

        var staticCat = document.getElementById('static-cat');
        staticCat.parentNode.removeChild(staticCat);

        play();

    }

    function initVideo(giphy, start) {
        function init() {
            giphy(giphy_search_term, function(url) {
                var i = cats.length;

                cats.push({
                    loaded: false
                });

                var attributes = {
                    id: 'cat' + i,
                    src: url,
                    type: 'video/mp4',
                    style: document.getElementById('static-cat').getAttribute('style')

                };

                var videoElement = document.createElement('video');

                for (var attr in attributes) {
                    if (attributes.hasOwnProperty(attr)) {
                        videoElement.setAttribute(attr, attributes[attr]);
                    }
                }

                videoElement.oncontextmenu = function() {
                    return false;
                };

                videoElement.oncanplaythrough = function() {
                    cats[i].loaded = true;
                    if (cats.length === cache_size && cats.every(
                        function(cat) {
                            return cat.loaded;
                        })) {
                        start(giphy);
                    }
                };

                document.getElementById('cats').appendChild(videoElement);
                document.getElementById('cat' + i).style.display = 'none';
            });
        }

        for (var i = 0; i < cache_size; i++) {
            init();
        }
    }

    window.onload =
        function() {
            // remove static cat image
            var staticCat = document.getElementById('static-cat');
            staticCat.src =
                'http://loremflickr.com/' + Math.floor(window.innerWidth / 4) +
                '/' + Math.floor(window.innerHeight / 4) + '/cat';

            if (Modernizr.video) {
                Modernizr.on('videoautoplay',
                    function(videoautoplay) {
                        if (videoautoplay) {
                            // if (false) {
                            if (Modernizr.video.h264) {
                                initVideo(Giphy.getMP4, startVideo);
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
