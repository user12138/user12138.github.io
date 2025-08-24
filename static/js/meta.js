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
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, hexCode) => {
            return String.fromCharCode('0x' + hexCode);
        }));
    } catch (error) {
        console.error('[Meta] Base64编码失败:', error);
        return '';
    }
}

function initializePageMeta(appId) {
    document.addEventListener('DOMContentLoaded', async () => {
        const STAT_SERVER_URL = 'https://eodl.ypingcn.com/worker/ip-geo/v2';
        const STORAGE_KEY_HISTORY = `${appId}_meta_info`;
        const STORAGE_KEY_CURRENT = `${appId}_meta_cur_info`;
        const MAX_RECORDS = 10;

        let historyRecords = [];
        let currentRecord = null;
        
        try {
            historyRecords = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
            currentRecord = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT)) || null;
        } catch (error) {
            console.error('[Meta] 加载本地存储记录失败:', error);
        }
        

        const lastVisitIp = determineLastVisitIp(historyRecords, currentRecord);
        const requestUrl = buildStatUrl(STAT_SERVER_URL, appId, lastVisitIp);
        
        try {
            const response = await fetch(requestUrl, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP请求失败: ${response.status}`);
            }
            
            const responseData = await response.json();
            
            await handleVisitRecords(
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
            console.error('[Meta] 请求失败:', error);
        }
        
        initializeLinkStat(STAT_SERVER_URL, appId);
    });
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

async function handleVisitRecords(
    nowVisitIp, 
    lastVisitIp, 
    currentRecord, 
    historyRecords,
    currentKey,
    historyKey,
    maxRecords
) {
    const currentIp = currentRecord ? currentRecord.ip : null;
    const shouldSaveRecord = currentIp !== nowVisitIp;
    
    if (!shouldSaveRecord) {
        return;
    }
    
    console.log(`[Meta] IP变化检测到(${currentIp || '无'} -> ${nowVisitIp})，开始保存记录`);
    
    const visitRecord = {
        ip: nowVisitIp,
        timestamp: Date.now(),
    };
    
    try {
        localStorage.setItem(currentKey, JSON.stringify(visitRecord));
    } catch (error) {
        console.error('[Meta] 保存当前访问记录失败:', error);
    }
    
    if (lastVisitIp !== null && lastVisitIp !== nowVisitIp) {
        try {
            const updatedHistoryRecords = [visitRecord, ...historyRecords].slice(0, maxRecords);
            localStorage.setItem(historyKey, JSON.stringify(updatedHistoryRecords));
        } catch (error) {
            console.error('[Meta] 保存历史访问记录失败:', error);
        }
    }
}

function renderPageMetaInfo(responseData, lastVisitIp) {
    const metaElement = document.getElementById('page-meta');
    if (!metaElement) {
        console.warn('[Meta] 未找到page-meta元素，跳过渲染');
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
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', async (event) => {
            try {
                const reportParams = new URLSearchParams({
                    appId: appId,
                    from: encodeToBase64Safe(window.location.href),
                    to: encodeToBase64Safe(link.href)
                });
                
                const reportUrl = `${baseUrl}?${reportParams.toString()}`;
                
                fetch(reportUrl, {
                    method: 'GET',
                    credentials: 'include'
                }).catch(error => {
                    console.error('[Meta] 点击统计发送失败:', error);
                });
                
            } catch (error) {
                console.error('[Meta] 点击统计处理失败:', error);
            }
        });
    });
}

if (document.currentScript && document.currentScript.hasAttribute('appId')) {
    const appId = document.currentScript.getAttribute('appId');
    initializePageMeta(appId);
}