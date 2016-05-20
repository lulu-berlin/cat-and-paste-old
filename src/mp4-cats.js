module.exports = function(searchTerm, cacheSize) {
    'use strict';

    var giphy = require('giphy');

    var cats = [];

    function startVideo() {
        for (var i = 0; i < cacheSize; i++) {
            cats[i].element = document.getElementById('cat' + i);
        }

        var cur_cat = -1;

        function play() {
            if (cur_cat === -1) {
                var availableCat =
                    cats.find(function(cat) {
                        return cat.loaded;
                    });

                if (availableCat) {
                    cur_cat = cats.indexOf(availableCat);
                    availableCat.element.play();
                    availableCat.element.style.display = 'block';
                    availableCat.element.onended = function() {
                        if (cur_cat !== -1) {
                            switchCat(cur_cat);
                        }
                    };
                } else {
                    setInterval(play, 100);
                }
            }
        }

        function switchCat(i) {
            cats[i].element.style.display = 'none';
            cats[i].loaded = false;
            cur_cat = -1;

            giphy.getMP4(searchTerm, function(url) {
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

    function init() {
        giphy.getMP4(searchTerm, function(url) {
            var i = cats.length;

            cats.push({
                loaded: false
            });

            var videoElement = document.createElement('video');

            videoElement.setAttribute('id', 'cat' + i);
            videoElement.setAttribute('src', url);
            videoElement.setAttribute('type', 'video/mp4');
            videoElement.setAttribute('style', document.getElementById('static-cat').getAttribute('style'));

            videoElement.oncontextmenu = function() {
                return false;
            };

            videoElement.oncanplaythrough = function() {
                cats[i].loaded = true;
                if (cats.length === cacheSize && cats.every(
                    function(cat) {
                        return cat.loaded;
                    })) {
                    startVideo();
                }
            };

            document.getElementById('cats').appendChild(videoElement);
            document.getElementById('cat' + i).style.display = 'none';
        });
    }

    for (var i = 0; i < cacheSize; i++) {
        init();
    }
};
