document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput');
  const sortButton = document.getElementById('sortButton');
  const copyButton = document.getElementById('copyButton');
  const sortResult = document.getElementById('sortResult');
  const sortTypeInputs = document.getElementsByName('sortType');

  // 排序按钮点击事件
  sortButton.addEventListener('click', sortText);

  // 复制按钮点击事件
  copyButton.addEventListener('click', copyResultToClipboard);

  // 文本排序主函数
  function sortText() {
    const text = textInput.value.trim();

    // 清除之前的错误信息
    clearError();

    // 验证输入
    if (!text) {
      showError('请输入要排序的文本');
      return;
    }

    try {
      // 获取选中的排序方式
      const selectedSortType = getSelectedSortType();

      // 将文本按行分割成数组
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length === 0) {
        showError('没有有效的文本行');
        return;
      }

      // 根据选择的排序方式进行排序
      const sortedLines = sortLines(lines, selectedSortType);

      // 显示结果
      showSuccess(sortedLines.join('\n'));
    } catch (error) {
      showError('排序过程中出现错误：' + error.message);
    }
  }

  // 获取选中的排序方式
  function getSelectedSortType() {
    for (let i = 0; i < sortTypeInputs.length; i++) {
      if (sortTypeInputs[i].checked) {
        return sortTypeInputs[i].value;
      }
    }
    return 'alphabetical-asc'; // 默认值
  }

  // 对文本行进行排序
  function sortLines(lines, sortType) {
    switch (sortType) {
      case 'alphabetical-asc':
        // 按字母正序排序
        return lines.sort((a, b) => a.localeCompare(b));
      case 'alphabetical-desc':
        // 按字母倒序排序
        return lines.sort((a, b) => b.localeCompare(a));
      case 'length-asc':
        // 按长度正序排序
        return lines.sort((a, b) => a.length - b.length);
      case 'length-desc':
        // 按长度倒序排序
        return lines.sort((a, b) => b.length - a.length);
      default:
        // 默认按字母正序排序
        return lines.sort((a, b) => a.localeCompare(b));
    }
  }

  // 显示成功结果
  function showSuccess(result) {
    sortResult.innerHTML = `<div class="success-result">${escapeHtml(result)}</div>`;
    copyButton.style.display = 'inline-block';
  }

  // 显示错误信息
  function showError(message) {
    sortResult.innerHTML = `<div class="error-message">${message}</div><div class="empty-result">排序后的文本将显示在这里</div>`;
    copyButton.style.display = 'none';
  }

  // 清除错误信息
  function clearError() {
    const errorElement = sortResult.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // HTML 转义
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 复制结果到剪贴板
  function copyResultToClipboard() {
    const resultElement = sortResult.querySelector('.success-result');
    if (!resultElement) {
      alert('没有可复制的结果');
      return;
    }

    const result = resultElement.textContent;

    try {
      // 使用现代Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(result).then(() => {
          showCopySuccess();
        }).catch(() => {
          // 如果现代API失败，回退到传统方法
          fallbackCopyTextToClipboard(result);
        });
      } else {
        // 浏览器不支持现代Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(result);
      }
    } catch (error) {
      alert('复制失败，请手动选择结果进行复制');
    }
  }

  // 传统复制方法
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess();
      } else {
        throw new Error('复制命令失败');
      }
    } catch (err) {
      alert('复制失败，请手动选择结果进行复制');
    }

    document.body.removeChild(textArea);
  }

  // 显示复制成功提示
  function showCopySuccess() {
    const originalText = copyButton.textContent;
    copyButton.textContent = '已复制!';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  }
});