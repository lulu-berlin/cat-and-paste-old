module.exports = function(searchTerm, cacheSize) {
    'use strict';

    var giphy = require('giphy');

    var cats = [];

    // helping out the uglifier
    var getElementById = document.getElementById.bind(document);

    function startVideo() {
        var currentCat = -1;

        for (var i = 0; i < cacheSize; i++) {
            cats[i].element = getElementById('cat' + i);
        }

        function play() {
            if (currentCat !== -1) {
                return;
            }

            var availableCat =
                cats.find(function(cat) {
                    return cat.loaded;
                });


            if (availableCat) {
                window.focus();
                currentCat = cats.indexOf(availableCat);
                availableCat.element.play();
                window.onfocus = function() {
                    availableCat.element.play();
                };
                window.onblur = function() {
                    availableCat.element.pause();
                };
                availableCat.element.style.display = 'block';
                availableCat.element.onended = function() {
                    if (currentCat !== -1) {
                        switchCat(currentCat);
                    }
                };
            } else {
                setInterval(play, 100);
            }
        }

        function switchCat(i) {
            cats[i].element.style.display = 'none';
            cats[i].loaded = false;
            currentCat = -1;

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

        var staticCat = getElementById('static-cat');
        staticCat.parentNode.removeChild(staticCat);

        play();
    }

    function init() {
        giphy.getMP4(searchTerm, function(url) {
            var catIndex = cats.length;

            cats.push({
                loaded: false
            });

            var videoElement = document.createElement('video');

            ('id=cat' + catIndex + ',src=' + url + ',type=video/mp4,' + 'style=' +
                getElementById('static-cat').getAttribute('style') + ';display:none')
            .split(',').forEach(function(element) {
                videoElement.setAttribute.apply(videoElement, element.split('='));
            });

            videoElement.oncontextmenu = function() {
                return false;
            };

            videoElement.oncanplaythrough = function() {
                cats[catIndex].loaded = true;
                if (cats.length === cacheSize && cats.every(
                    function(cat) {
                        return cat.loaded;
                    })) {
                    startVideo();
                }
            };

            getElementById('cats').appendChild(videoElement);
        });
    }

    for (var i = 0; i < cacheSize; i++) {
        init();
    }
};
