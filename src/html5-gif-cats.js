module.exports = function(searchTerm, cacheSize) {
    'use strict';

    var giphy = require('giphy');

    var cats = [];

    // helping out the uglifier
    var getElementById = document.getElementById.bind(document);

    var currentCat = -1;

    function switchCat(i) {
        cats[i].loader.pause();
        cats[i].loader.get_canvas().style.display = 'none';
        cats[i].loaded = false;
        currentCat = -1;

        giphy.getGIF(searchTerm, function(url) {
            cats[i].loader.load_url(url, function() {
                cats[i].loaded = true;
            });
        });
        play();
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
            currentCat = cats.indexOf(availableCat);

            window.focus();

            availableCat.loader.get_canvas().style.display = 'block';
            availableCat.loader.play();

            window.onfocus = function() {
                availableCat.loader.play();
            };
            window.onblur = function() {
                availableCat.loader.pause();
            };
        } else {
            setInterval(play, 100);
        }
    }

    var SuperGif = require('supergif');

    function init() {
        giphy.getGIF(searchTerm, function(url) {
            var catIndex = cats.length;

            cats.push({
                loaded: false
            });

            var imgElement = document.createElement('img');
            getElementById('cats').appendChild(imgElement);

            var catLoader = SuperGif({
                gif: imgElement,
                auto_play: false,
                loop_mode: false,
                on_end: function() {
                    switchCat(currentCat);
                }
            });

            catLoader.load_url(url, function() {
                cats[catIndex].loaded = true;
                cats[catIndex].loader = catLoader;
                if (cats.length === cacheSize && cats.every(
                    function(cat) {
                        return cat.loaded;
                    })) {
                    cats.forEach(function(cat) {
                        var canvas = cat.loader.get_canvas();
                        canvas.setAttribute('style',
                            getElementById('static-cat')
                            .getAttribute('style') +
                            ';display:none');
                        canvas.oncontextmenu = function() {
                            return false;
                        };
                    });

                    var staticCat = getElementById('static-cat');
                    staticCat.parentNode.removeChild(staticCat);
                    play();
                }
            });

            catLoader.get_canvas().style.display = 'none';

            /*
            ('id=cat' + catIndex + ',src=' + url + ',type=video/mp4,' + 'style=' +
                getElementById('static-cat').getAttribute('style') + ';display:none')
            .split(',').forEach(function(element) {
                imgElement.setAttribute.apply(imgElement, element.split('='));
            });

            imgElement.oncontextmenu = function() {
                return false;
            };

            imgElement.oncanplaythrough = function() {
                cats[catIndex].loaded = true;
                if (cats.length === cacheSize && cats.every(
                    function(cat) {
                        return cat.loaded;
                    })) {
                    startVideo();
                }
            };

            */
        });
    }

    for (var i = 0; i < cacheSize; i++) {
        init();
    }
};
