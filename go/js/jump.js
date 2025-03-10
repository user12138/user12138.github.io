function parseQueryString(queryString) {
    const params = {};
    const queries = queryString.split("&");
    for (const query of queries) {
        const [key, value] = query.split('=');
        if (key) {
            params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
        }
    }
    return params;
}

function goUrl(config, timeoutMs, replaceElement) {
    fetch(config + `?t=${Date.now()}`)
       .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
       .then(routes => {
            const queries = parseQueryString(location.search.substring(1));
            let key = queries['r'];
            if (!key) {
                key = 'def';
            }
            const url = routes[key] || '/error.html';
            console.log(`${key} redirecting to ${url}`);
            if (replaceElement) {
                const element = document.getElementById(replaceElement);
                if (element) {
                    element.textContent = url;
                }
            }
            setTimeout(() => {
                window.location.href = url;
            }, timeoutMs);
        })
       .catch(error => {
            console.error('Error:', error);
        });
}