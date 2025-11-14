---
layout: spa-default
title: "文本排序工具 | 混沌书签导航"
copyright: true
promotion: false
bottom-banner-ads: true
---

<link rel="stylesheet" href="./style.css">
<script src="./script.js"></script>

<div class="sort-container">
    <div class="sort-header">
        <h1>文本排序工具</h1>
        <p>浏览器本地处理，支持按字母顺序正序/倒序、文字长度等多种方式对文本进行排序</p>
    </div>

    <div class="input-section">
        <label class="input-label" for="textInput">请输入要排序的文本（每行一个项目）：</label>
        <div class="textarea-container">
            <textarea class="text-input" id="textInput" placeholder="在此输入您的文本,如：&#10;&#10;香蕉&#10;苹果&#10;橙子&#10;葡萄&#10;草莓"></textarea>
        </div>
    </div>

    <div class="controls-section">
        <div class="sort-options">
            <label class="input-label"></label>
            <div class="radio-group">
                <label class="radio-container">
                    <input type="radio" name="sortType" value="alphabetical-asc" checked>
                    <span class="radio-checkmark">按字母正序</span>
                </label>
                <label class="radio-container">
                    <input type="radio" name="sortType" value="alphabetical-desc">
                    <span class="radio-checkmark">按字母倒序</span>
                </label>
                <label class="radio-container">
                    <input type="radio" name="sortType" value="length-asc">
                    <span class="radio-checkmark">按长度正序</span>
                </label>
                <label class="radio-container">
                    <input type="radio" name="sortType" value="length-desc">
                    <span class="radio-checkmark">按长度倒序</span>
                </label>
            </div>
        </div>
        <button class="sort-button" id="sortButton">排序文本</button>
    </div>
</div>