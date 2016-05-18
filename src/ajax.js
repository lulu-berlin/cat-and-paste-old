module.exports = (function() {
    'use strict';

    function getJSON(url, callback) {
        var request = new XMLHttpRequest();

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                callback(data);
            } else {
                setTimeout(function() {
                    getJSON(url, callback);
                }, 1000);
            }
        });

        request.addEventListener('error', function() {
            setTimeout(function() {
                getJSON(url, callback);
            }, 1000);
        });

        request.open('GET', url, true);

        request.send();
    }

    function param(data) {
        return Object.keys(data).reduce(function(acc, prefix) {
            return (acc ? acc + '&' : '') + prefix + '=' + data[prefix];
        }, '');
    }

    return {
        getJSON: getJSON,
        param: param
    };
})();
