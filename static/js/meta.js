function metaCreateLink(text, href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank';
    link.rel = 'noopener nofollow noreferrer';
    return link;
}

function metaFetch(appId) {
    document.addEventListener('DOMContentLoaded', function () {
        function btoaSafe(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        }
        const url = `https://api.ypingcn.com/worker/ip-geo/v1?appId=${appId}&from=` + btoaSafe(window.location.href);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const metaSpan = document.getElementById('page-meta');
                if (metaSpan) {
                    metaSpan.textContent = `${data.requestId}##${data.ip}##${data.ua}`;
                    metaSpan.appendChild(document.createTextNode(data.requestId));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(createLink(ip, `https://ping0.cc/ip/${data.ip}`));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(document.createTextNode(data.ua));
                }
            })
            .catch(error => {
                console.error('error fetching page meta info', error);
            });
    });
}

if (document.currentScript &&
    document.currentScript.hasAttribute('appId')) {
    const appId = document.currentScript.getAttribute('appId');
    metaFetch(appId);
}