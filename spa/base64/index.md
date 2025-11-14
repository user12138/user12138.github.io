---
layout: spa-default
title: "Base64编码解码工具 | 混沌书签导航"
copyright: true
promotion: false
bottom-banner-ads: true
---

<link rel="stylesheet" href="./style.css">
<script src="./script.js"></script>

<div class="base64-container">
    <div class="base64-header">
        <h1>Base64编码解码工具</h1>
        <p>支持文本与Base64格式之间的相互转换</p>
    </div>

    <div class="converter-layout">
        <div class="input-section">
            <label class="input-label" for="textInput">原始文本：</label>
            <div class="textarea-container">
                <textarea class="text-input" id="textInput" placeholder="在此输入要编码的文本"></textarea>
            </div>
        </div>

        <div class="button-section">
            <button class="convert-button" id="encodeButton">编码为Base64 →</button>
            <button class="convert-button" id="decodeButton">← 解码为文本</button>
        </div>

        <div class="input-section">
            <label class="input-label" for="base64Input">Base64编码：</label>
            <div class="textarea-container">
                <textarea class="text-input" id="base64Input" placeholder="在此输入要解码的Base64编码"></textarea>
            </div>
        </div>
    </div>
</div>