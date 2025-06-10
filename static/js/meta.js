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
        let metaKey = `meta_info_${appId}`;
        let metaLocalInfo = [];
        try {
            metaLocalInfo = JSON.parse(localStorage.getItem(metaKey)) || [];
        } catch (e) {
            console.error('get meta_info failed... ', e);
        }
        const lastVisitIp = metaLocalInfo.length > 0 ? metaLocalInfo[0].ip : null;
        const url = `https://api.ypingcn.com/worker/ip-geo/v1?appId=${appId}&from=` + btoaSafe(window.location.href) + `&lastVisit=` + lastVisitIp;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (lastVisitIp != response.ip) {
                    const metaRecord = {
                        ip: response.ip,
                        requestId: response.requestId,
                        timestamp: Date.now(),
                    };
                    try {
                        const updatedMetas = [metaRecord, ...metaLocalInfo].slice(0, 10);
                        localStorage.setItem(metaKey, JSON.stringify(updatedMetas));
                    } catch (e) {
                        console.error('save visit info failed... ', e);
                    }
                }

                const metaSpan = document.getElementById('page-meta');
                if (metaSpan) {
                    // metaSpan.textContent = `${response.requestId}##${response.ip}##${response.ua}`;
                    metaSpan.innerHTML = '';
                    metaSpan.appendChild(document.createTextNode(response.requestId));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(metaCreateLink(response.ip, `https://ping0.cc/ip/${response.ip}`));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(document.createTextNode(response.ua));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(document.createTextNode(response.asOrganization));
                    if (lastVisitIp != response.ip) {
                        metaSpan.appendChild(document.createTextNode('|'));
                        metaSpan.appendChild(metaCreateLink("lastVisit", `https://ping0.cc/ip/${lastVisitIp}`));
                    }
                }
            })
            .catch(error => {
                console.error('rendering page meta info failed... ', error);
            });
    });
}

if (document.currentScript &&
    document.currentScript.hasAttribute('appId')) {
    const appId = document.currentScript.getAttribute('appId');
    metaFetch(appId);
}