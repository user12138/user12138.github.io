---
layout: spa-default
title: "在线文本转表格工具 | 混沌书签导航"
copyright: true
promotion: false
bottom-banner-ads: true
---

<link rel="stylesheet" href="./style.css">
<script src="./script.js"></script>

<div class="spa-page-container">
    <div class="spa-page-header">
        <h1>在线文本转表格工具</h1>
        <p>浏览器本地处理，将文本数据快速转换为清晰易读的表格格式</p>
    </div>
    <div class="input-section">
        <label class="input-label" for="textInput">请输入要转换的文本：</label>
        <div class="textarea-container">
            <textarea class="text-input" id="textInput"
                placeholder="在此输入您的文本数据,如:&#10;&#10;姓名,年龄,城市&#10;张三,25,北京&#10;李四,30,上海"></textarea>
        </div>
    </div>
    <div class="controls-section">
        <div class="delimiter-control">
            <span>分隔符：</span>
            <select class="delimiter-select" id="delimiterSelect">
                <option value="comma">逗号 (,)</option>
                <option value="tab">制表符 (Tab)</option>
                <option value="semicolon">分号 (;)</option>
                <option value="pipe">管道符 (|)</option>
                <option value="space">空格</option>
                <option value="custom">自定义</option>
            </select>
            <input class="custom-delimiter" type="text" id="customDelimiter" placeholder="输入字符" maxlength="5"
                style="display: none;">
        </div>
        <button class="action-button" id="convertButton">转换为表格</button>
    </div>

    <div class="result-section">
        <div class="result-header">
            <div class="result-title">转换结果：</div>
            <button class="copy-button" id="copyButton" style="display: none;">复制表格</button>
        </div>
        <div class="table-container">
            <div id="resultContainer">
                <div class="empty-result">转换后的表格将显示在这里</div>
            </div>
        </div>
    </div>
</div>