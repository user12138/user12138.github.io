(function() {
    'use strict';

    function createSafeExternalLink(text, href) {
        const linkElement = document.createElement('a');
        linkElement.href = href;
        linkElement.textContent = text;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener nofollow noreferrer';
        return linkElement;
    }

    function encodeToBase64Safe(str) {
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            console.error('[Meta] Base64 encode failed:', error);
            return '';
        }
    }

    function safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('[Meta] save to localStorage failed:', error);
            return false;
        }
    }

    function safeLocalStorageGet(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('[Meta] load from localStorage failed:', error);
            return defaultValue;
        }
    }

    function initializePageMeta(appId) {
        const init = async () => {
            const STAT_SERVER_URL = 'https://eodl.ypingcn.com/worker/ip-geo/v2';
            const STORAGE_KEY_HISTORY = `${appId}-meta-his-info`;
            const STORAGE_KEY_CURRENT = `${appId}-meta-cur-info`;
            const MAX_RECORDS = 50;

            let historyRecords = safeLocalStorageGet(STORAGE_KEY_HISTORY, []);
            let currentRecord = safeLocalStorageGet(STORAGE_KEY_CURRENT, null);

            const lastVisitIp = determineLastVisitIp(historyRecords, currentRecord);
            const requestUrl = buildStatUrl(STAT_SERVER_URL, appId, lastVisitIp);

            try {
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`[Meta] http request failed: ${response.status}`);
                }

                const responseData = await response.json();

                handleVisitRecords(
                    responseData.ip,
                    lastVisitIp,
                    currentRecord,
                    historyRecords,
                    STORAGE_KEY_CURRENT,
                    STORAGE_KEY_HISTORY,
                    MAX_RECORDS
                );

                renderPageMetaInfo(responseData, lastVisitIp);

            } catch (error) {
                console.error('[Meta] request failed:', error);
            }

            initializeLinkStat(STAT_SERVER_URL, appId);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    function determineLastVisitIp(historyRecords, currentRecord) {
        if (historyRecords.length === 0) {
            return null;
        }
        const latestHistoryIp = historyRecords[0].ip;
        if (currentRecord && currentRecord.ip === latestHistoryIp) {
            return historyRecords.length > 1 ? historyRecords[1].ip : null;
        }
        return latestHistoryIp;
    }

    function buildStatUrl(baseUrl, appId, lastVisitIp) {
        const params = new URLSearchParams({
            appId: appId,
            lastVisit: lastVisitIp || '',
            from: encodeToBase64Safe(window.location.href)
        });
        return `${baseUrl}?${params.toString()}`;
    }

    function handleVisitRecords(
        nowVisitIp,
        lastVisitIp,
        currentRecord,
        historyRecords,
        currentKey,
        historyKey,
        maxRecords
    ) {
        const currentRecordIp = currentRecord ? currentRecord.ip : null;
        const shouldSaveRecord = currentRecordIp !== nowVisitIp;

        if (!shouldSaveRecord) {
            return;
        }

        console.log(`[Meta] detect changed, (${currentRecordIp || 'NULL'} -> ${nowVisitIp}), ready to save.`);

        const visitRecord = {
            ip: nowVisitIp,
            timestamp: Date.now(),
        };

        safeLocalStorageSet(currentKey, visitRecord);

        if (lastVisitIp !== nowVisitIp) {
            const updatedHistoryRecords = [visitRecord, ...historyRecords].slice(0, maxRecords);
            safeLocalStorageSet(historyKey, updatedHistoryRecords);
        }
    }

    function renderPageMetaInfo(responseData, lastVisitIp) {
        const metaElement = document.getElementById('page-meta');
        if (!metaElement) {
            console.warn('[Meta] page-meta element not found.');
            return;
        }

        metaElement.innerHTML = '';
        const metaItems = [
            `[${responseData.elapsed}ms]`,
            responseData.requestId,
            createSafeExternalLink(responseData.ip, `https://ping0.cc/ip/${responseData.ip}`),
            responseData.ua,
            responseData.asOrganization
        ];
        if (lastVisitIp && lastVisitIp !== responseData.ip) {
            metaItems.push(createSafeExternalLink(lastVisitIp, `https://ping0.cc/ip/${lastVisitIp}`));
        }
        metaItems.forEach((item, index) => {
            if (index > 0) {
                metaElement.appendChild(document.createTextNode('|'));
            }

            if (typeof item === 'string') {
                metaElement.appendChild(document.createTextNode(item));
            } else {
                metaElement.appendChild(item);
            }
        });
    }

    function initializeLinkStat(baseUrl, appId) {
        document.addEventListener('click', async (event) => {
            const link = event.target.closest('a');
            if (!link) return;

            try {
                const reportParams = new URLSearchParams({
                    appId: appId,
                    from: encodeToBase64Safe(window.location.href),
                    to: encodeToBase64Safe(link.href)
                });

                const reportUrl = `${baseUrl}?${reportParams.toString()}`;

                if (navigator.sendBeacon) {
                    navigator.sendBeacon(reportUrl);
                } else {
                    fetch(reportUrl, {
                        method: 'GET',
                        credentials: 'include',
                        keepalive: true
                    }).catch(error => {
                        console.error('[Meta] stat request failed:', error);
                    });
                }

            } catch (error) {
                console.error('[Meta] stat failed:', error);
            }
        });
    }

    if (document.currentScript && document.currentScript.hasAttribute('data-app-id')) {
        const appId = document.currentScript.getAttribute('data-app-id');
        initializePageMeta(appId);
    }
})();
