---
layout: spa-default
title: "文件哈希计算工具 | 混沌书签导航"
copyright: true
promotion: false
bottom-banner-ads: true
---

<link rel="stylesheet" href="./style.css">
<!-- 引入 CryptoJS 库用于哈希计算 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
<script src="./script.js"></script>

<div class="spa-page-container">
    <div class="spa-page-header">
        <h1>文件哈希计算工具</h1>
        <p>浏览器本地处理，支持拖拽文件并使用多种算法计算文件摘要</p>
    </div>

    <div class="drop-area" id="dropArea">
        <div class="drop-content">
            <p>将文件拖拽到此处或点击选择文件</p>
            <input type="file" id="fileInput" class="file-input" multiple>
            <button class="action-button" id="browseButton">浏览文件</button>
        </div>
        <div class="file-list" id="fileList" style="display: none;">
            <h3>已选择的文件列表</h3>
            <div class="file-details-container" id="fileDetailsContainer">
                <!-- 文件信息将动态插入到这里 -->
            </div>
        </div>
    </div>

    <div class="controls-section">
        <div class="algorithm-options">
            <label class="input-label"></label>
            <div class="checkbox-group">
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="MD5" checked>
                    <span class="checkmark">MD5</span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="SHA1">
                    <span class="checkmark">SHA1</span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="SHA256">
                    <span class="checkmark">SHA256</span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="SHA512">
                    <span class="checkmark">SHA512</span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="SHA3-256">
                    <span class="checkmark">SHA3-256</span>
                </label>
                <label class="checkbox-container">
                    <input type="checkbox" name="algorithms" value="SHA3-512">
                    <span class="checkmark">SHA3-512</span>
                </label>
            </div>
        </div>
        
        <button class="action-button" id="calculateButton">计算哈希</button>
    </div>

    <div class="result-section">
        <div class="result-content">
            <div id="hashResult" class="hash-result">
                <div class="empty-result">计算后的哈希值将显示在这里</div>
            </div>
        </div>
    </div>
</div>