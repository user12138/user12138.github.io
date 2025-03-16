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

async function fetchAndParseJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        throw error;
    }
}

function goUrl(config, timeoutMs, replaceElement) {
    if (typeof config !== 'string' || typeof timeoutMs !== 'number') {
        console.error('Invalid parameters for goUrl function.');
        return;
    }
    const urlWithTimestamp = config + `?t=${Math.floor(Date.now() / 3600)}`;
    fetchAndParseJson(urlWithTimestamp)
        .then(routes => {
            const queries = parseQueryString(location.search.substring(1));
            const key = queries['r'];
            const url = routes[key] || routes['def'] || '/error.html';
            if (replaceElement) {
                const element = document.getElementById(replaceElement);
                if (element) {
                    element.textContent = url;
                }
            }
            if (queries['t'] !== undefined) {
                const tValue = parseFloat(queries['t']);
                if (!isNaN(tValue)) {
                    timeoutMs = tValue;
                }
            }
            console.log(`${key} redirecting to ${url} with timeout ${timeoutMs}ms`);
            setTimeout(() => {
                window.location.href = url;
            }, timeoutMs);
        })
        .catch(error => {
            console.error('Error in goUrl:', error);
        });
}

if (document.currentScript &&
    document.currentScript.hasAttribute('config') &&
    document.currentScript.hasAttribute('timeoutms') &&
    document.currentScript.hasAttribute('element')) {
    const config = document.currentScript.getAttribute('config');
    const timeoutMsStr = document.currentScript.getAttribute('timeoutms');
    const timeoutMs = parseInt(timeoutMsStr, 10);
    const replaceElement = document.currentScript.getAttribute('element');

    if (isNaN(timeoutMs)) {
        timeoutMs = 0;
    }
    goUrl(config, timeoutMs, replaceElement);
}