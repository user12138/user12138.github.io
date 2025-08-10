function metaCreateLink(text, href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank';
    link.rel = 'noopener nofollow noreferrer';
    return link;
}

function btoaSafe(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function metaAction(appId) {
    document.addEventListener('DOMContentLoaded', async () => {
        const statServerUrl = `https://eodl.ypingcn.com/worker/ip-geo/v2`
        let metaKey = `meta_info_${appId}`;
        let metaLocalInfo = [];
        try {
            metaLocalInfo = JSON.parse(localStorage.getItem(metaKey)) || [];
        } catch (e) {
            console.error('get meta_info failed... ', e);
        }
        const lastVisitIp = metaLocalInfo.length > 0 ? metaLocalInfo[0].ip : null;
        const url = `${statServerUrl}?appId=${appId}&lastVisit=${lastVisitIp}&from=` + btoaSafe(window.location.href);
        const fetchData = async () => {
            fetch(url, {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (lastVisitIp != null && lastVisitIp != response.ip) {
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
                    metaSpan.innerHTML = '';
                    metaSpan.appendChild(document.createTextNode(`[${response.elapsed}ms]|`));
                    metaSpan.appendChild(document.createTextNode(response.requestId));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(metaCreateLink(response.ip, `https://ping0.cc/ip/${response.ip}`));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(document.createTextNode(response.ua));
                    metaSpan.appendChild(document.createTextNode('|'));
                    metaSpan.appendChild(document.createTextNode(response.asOrganization));
                    if (lastVisitIp != null && lastVisitIp != response.ip) {
                        metaSpan.appendChild(document.createTextNode('|'));
                        metaSpan.appendChild(metaCreateLink(lastVisitIp, `https://ping0.cc/ip/${lastVisitIp}`));
                    }
                }
            })
            .catch(error => {
                console.error('rendering page meta info failed... ', error);
            });
        };
        await fetchData();

        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', async function (e) {
                try {
                    const reportUrl = `${statServerUrl}?appId=${appId}&from=` + btoaSafe(window.location.href) + `&to=` + btoaSafe(link.href);
                    const isNewTab = this.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey;
                    if (isNewTab) {
                        fetch(reportUrl, {
                            method: 'GET',
                            credentials: 'include'
                        })
                    } else {
                        const img = new Image();
                        img.src = trackUrl;
                        img.onerror = () => console.error('report click failed... ');
                    }
                } catch (error) {
                    console.error('report click failed... ', error);
                }
            });
        });
    });
}

if (document.currentScript &&
    document.currentScript.hasAttribute('appId')) {
    const appId = document.currentScript.getAttribute('appId');
    metaAction(appId);
}