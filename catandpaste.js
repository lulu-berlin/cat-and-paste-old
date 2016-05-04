$(function() {
    "use strict";

    var CatAndPaste = function (platform) {

        var cache_size = 5;
        var cats = [];
        var giphy_api_key = "dc6zaTOxFJmzC";
        var giphy_search_term = "cats";

        var giphy, start;

        switch (platform) {
            case "desktop":
                giphy = function (search_term, func) {
                    $.get("http://api.giphy.com/v1/gifs/random?api_key=" + giphy_api_key + "&tag=" + search_term)
                        .done(function (result) {
                            $.get("http://api.giphy.com/v1/gifs/" + result.data.id + "?api_key=" + giphy_api_key)
                                .done(function (result) {
                                    func(result.data.images.fixed_height.mp4); }); });
                };

                start = function () {
                    for (var i = 0; i < cache_size; i++) {
                        cats[i].element = $("#cat" + i);
                    }

                    var cur_cat = -1;

                    function play() {
                        if (cur_cat === -1) {
                            var available_cat = cats.find(function (cat) { return cat.loaded; });
                            if (available_cat) {
                                cur_cat = cats.indexOf(available_cat);
                                available_cat.element[0].play();
                                available_cat.element.off('ended');
                                available_cat.element.show();
                                available_cat.element.on('ended', function () {
                                    if (cur_cat !== -1) {
                                        switch_cat(cur_cat);
                                    }
                                });
                            }
                            else {
                                setInterval(play, 100);
                            }
                        }
                    }

                    function switch_cat(i) {
                        cats[i].element.hide();
                        cats[i].loaded = false;
                        cur_cat = -1;

                        giphy(giphy_search_term, function (url) {
                            cats[i].src = url;
                            cats[i].element[0].src = cats[i].src;
                            cats[i].element.off("click");
                            cats[i].element.off("canplaythrough");
                            cats[i].element[0].load();
                            cats[i].element.on("canplaythrough", function () { cats[i].loaded = true; });
                            cats[i].element.on("click", function () { play(); });
                        });
                        play();
                    }

                    $("#static-cat").remove();

                    play();
                };

                for (var i = 0; i < cache_size; i++) {
                    giphy(giphy_search_term, function (url) {
                        var i = cats.length;

                        cats.push({ src: url, loaded: false });

                        $("#cats")
                            .append( $("<video>")
                                    .attr("id", "cat" + i)
                                    .attr("src", cats[i].src)
                                    .attr("type", "video/mp4")
                                    .on("contextmenu", function () { return false; })
                                    .on("canplaythrough", function() {
                                        cats[i].loaded = true;
                                        if (cats.length === cache_size && cats.every(function (cat) { return cat.loaded; })) {
                                            start();
                                        } })
                                    .hide() ); });
                }
                break;

            case "mobile":
                console.log("not implemented");
                break;

            default:
                console.log("Unknown platform, cannot run.");
                break;
        }
    };

    $("#cats").append(
            $("<img>")
            .attr("id", "static-cat")
            .attr("src", "http://loremflickr.com/" + Math.floor(innerWidth/4) + "/" + Math.floor(innerHeight/4) + "/cat") );

    Modernizr.on("videoautoplay", function (videoautoplay) {
        if (videoautoplay && Modernizr.video) {
            CatAndPaste("desktop");
        } else {
            CatAndPaste("mobile");
        }
    });
});
