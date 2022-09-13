function parseQueryString(queryString) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};

function goUrl(config, timeoutMs, replaceElement) {
    fetch(config + `?t=${Date.now()}`)
        .then(response => response.json())
        .then(routes => {
            var queries = parseQueryString(location.search.substring(1))
            var key = queries['r']
            var url = routes[key];
            if (!url)
                url = '/error.html';
            console.log(`${key} redirecting to ${url}`);
            if (replaceElement)
                document.getElementById(replaceElement).innerHTML = url
            setTimeout(function () {
                window.location.href = url
            }, timeoutMs)
        })
        .catch(error => {
            console.log(error);
        });
}