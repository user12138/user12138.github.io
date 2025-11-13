document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput');
  const base64Input = document.getElementById('base64Input');
  const encodeButton = document.getElementById('encodeButton');
  const decodeButton = document.getElementById('decodeButton');

  // 编码按钮点击事件
  encodeButton.addEventListener('click', encodeToBase64);

  // 解码按钮点击事件
  decodeButton.addEventListener('click', decodeFromBase64);

  // Base64编码
  function encodeToBase64() {
    const text = textInput.value.trim();

    // 清除之前的错误信息
    clearError(textInput);

    // 验证输入
    if (!text) {
      showError(textInput, '请输入要编码的文本');
      return;
    }

    try {
      // 进行Base64编码
      const encoded = btoa(unescape(encodeURIComponent(text)));
      
      // 直接显示结果在Base64输入框中
      base64Input.value = encoded;
      clearError(base64Input);
    } catch (error) {
      showError(textInput, '编码过程中出现错误：' + error.message);
    }
  }

  // Base64解码
  function decodeFromBase64() {
    const base64 = base64Input.value.trim();

    // 清除之前的错误信息
    clearError(base64Input);

    // 验证输入
    if (!base64) {
      showError(base64Input, '请输入要解码的Base64编码');
      return;
    }

    try {
      // 验证Base64格式
      if (!isValidBase64(base64)) {
        showError(base64Input, '输入的不是有效的Base64编码');
        return;
      }

      // 进行Base64解码
      const decoded = decodeURIComponent(escape(atob(base64)));
      
      // 直接显示结果在文本输入框中
      textInput.value = decoded;
      clearError(textInput);
    } catch (error) {
      showError(base64Input, '解码过程中出现错误：' + error.message);
    }
  }

  // 验证Base64格式
  function isValidBase64(str) {
    // Base64格式正则表达式
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length % 4 === 0;
  }

  // 显示错误信息
  function showError(inputElement, message) {
    // 在输入框下方显示错误信息
    let errorElement = inputElement.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      inputElement.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  // 清除错误信息
  function clearError(inputElement) {
    const errorElement = inputElement.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
});