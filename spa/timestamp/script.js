document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  const timestampInput = document.getElementById('timestampInput');
  const toTimestampButton = document.getElementById('toTimestampButton');
  const toDatetimeButton = document.getElementById('toDatetimeButton');
  const toDatetimeMsButton = document.getElementById('toDatetimeMsButton');
  const currentDatetime = document.getElementById('currentDatetime');
  const currentTimestamp = document.getElementById('currentTimestamp');
  const currentMsTimestamp = document.getElementById('currentMsTimestamp');
  const refreshTimeButton = document.getElementById('refreshTimeButton');
  const copyTimestampButton = document.getElementById('copyTimestampButton');
  const copyMsTimestampButton = document.getElementById('copyMsTimestampButton');

  // 初始化当前时间
  updateCurrentTime();

  // 转换为时间戳按钮点击事件
  toTimestampButton.addEventListener('click', convertToTimestamp);

  // 转换为日期时间按钮点击事件
  toDatetimeButton.addEventListener('click', convertToDatetime);

  // 转换为日期时间(毫秒)按钮点击事件
  toDatetimeMsButton.addEventListener('click', convertToDatetimeMs);

  // 刷新时间按钮点击事件
  refreshTimeButton.addEventListener('click', function() {
    updateCurrentTime();
    showRefreshSuccess(refreshTimeButton);
  });

  // 复制秒级时间戳按钮点击事件
  copyTimestampButton.addEventListener('click', function() {
    copyToClipboard(currentTimestamp.textContent, copyTimestampButton);
  });

  // 复制毫秒级时间戳按钮点击事件
  copyMsTimestampButton.addEventListener('click', function() {
    copyToClipboard(currentMsTimestamp.textContent, copyMsTimestampButton);
  });

  // 转换为时间戳
  function convertToTimestamp() {
    const dateValue = dateInput.value;
    const timeValue = timeInput.value;

    // 清除之前的错误信息
    clearError(dateInput);

    // 验证输入
    if (!dateValue) {
      showError(dateInput, '请选择日期');
      return;
    }

    try {
      // 创建Date对象
      const date = new Date(`${dateValue}T${timeValue}:00`);
      
      // 验证日期有效性
      if (isNaN(date.getTime())) {
        showError(dateInput, '无效的日期时间');
        return;
      }
      
      // 获取时间戳（秒）
      const timestamp = Math.floor(date.getTime() / 1000);
      
      // 显示结果
      timestampInput.value = timestamp;
      clearError(timestampInput);
    } catch (error) {
      showError(dateInput, '转换过程中出现错误：' + error.message);
    }
  }

  // 转换为日期时间
  function convertToDatetime() {
    const timestampValue = timestampInput.value.trim();

    // 清除之前的错误信息
    clearError(timestampInput);

    // 验证输入
    if (!timestampValue) {
      showError(timestampInput, '请输入时间戳');
      return;
    }

    // 验证时间戳格式
    if (!/^-?\d+$/.test(timestampValue)) {
      showError(timestampInput, '时间戳必须为整数');
      return;
    }

    try {
      // 创建Date对象（秒级时间戳）
      const date = new Date(parseInt(timestampValue) * 1000);
      
      // 验证日期有效性
      if (isNaN(date.getTime())) {
        showError(timestampInput, '无效的时间戳');
        return;
      }
      
      // 格式化为本地日期时间字符串
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      // 设置日期和时间输入框的值
      dateInput.value = `${year}-${month}-${day}`;
      timeInput.value = `${hours}:${minutes}`;
      clearError(dateInput);
    } catch (error) {
      showError(timestampInput, '转换过程中出现错误：' + error.message);
    }
  }

  // 转换为日期时间(毫秒)
  function convertToDatetimeMs() {
    const timestampValue = timestampInput.value.trim();

    // 清除之前的错误信息
    clearError(timestampInput);

    // 验证输入
    if (!timestampValue) {
      showError(timestampInput, '请输入时间戳');
      return;
    }

    // 验证时间戳格式
    if (!/^-?\d+$/.test(timestampValue)) {
      showError(timestampInput, '时间戳必须为整数');
      return;
    }

    try {
      // 创建Date对象（毫秒级时间戳）
      const date = new Date(parseInt(timestampValue));
      
      // 验证日期有效性
      if (isNaN(date.getTime())) {
        showError(timestampInput, '无效的时间戳');
        return;
      }
      
      // 格式化为本地日期时间字符串
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      // 设置日期和时间输入框的值
      dateInput.value = `${year}-${month}-${day}`;
      timeInput.value = `${hours}:${minutes}`;
      clearError(dateInput);
    } catch (error) {
      showError(timestampInput, '转换过程中出现错误：' + error.message);
    }
  }

  // 更新当前时间显示
  function updateCurrentTime() {
    const now = new Date();
    
    // 显示当前日期时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    currentDatetime.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    // 显示秒级时间戳
    currentTimestamp.textContent = Math.floor(now.getTime() / 1000);
    
    // 显示毫秒级时间戳
    currentMsTimestamp.textContent = now.getTime();
  }

  // 复制到剪贴板
  function copyToClipboard(text, button) {
    try {
      // 使用现代Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showCopySuccess(button);
        }).catch(() => {
          // 如果现代API失败，回退到传统方法
          fallbackCopyTextToClipboard(text, button);
        });
      } else {
        // 浏览器不支持现代Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(text, button);
      }
    } catch (error) {
      alert('复制失败');
    }
  }

  // 传统复制方法
  function fallbackCopyTextToClipboard(text, button) {
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
        showCopySuccess(button);
      } else {
        throw new Error('复制命令失败');
      }
    } catch (err) {
      alert('复制失败');
    }

    document.body.removeChild(textArea);
  }

  // 显示复制成功提示
  function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '已复制!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 3000); // 延长到3秒
  }

  // 显示刷新成功提示
  function showRefreshSuccess(button) {
    const originalText = button.textContent;
    button.textContent = '已刷新!';
    button.classList.add('refreshed');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('refreshed');
    }, 3000); // 保持3秒
  }

  // 显示错误信息
  function showError(inputElement, message) {
    // 在输入框下方显示错误信息
    let errorElement = inputElement.parentNode.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      inputElement.parentNode.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  // 清除错误信息
  function clearError(inputElement) {
    const errorElement = inputElement.parentNode.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
});