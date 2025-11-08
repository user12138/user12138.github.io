document.addEventListener('DOMContentLoaded', function () {
  const postParams = document.getElementById('postParams');
  const secret = document.getElementById('secret');
  const timestamp = document.getElementById('timestamp');
  const refreshTimestamp = document.getElementById('refreshTimestamp');
  const useTimestamp = document.getElementById('useTimestamp');
  const uppercaseSignature = document.getElementById('uppercaseSignature');
  const generateSignature = document.getElementById('generateSignature');
  const copySignature = document.getElementById('copySignature');
  const signatureResult = document.getElementById('signatureResult');
  const keyInfo = document.getElementById('keyInfo'); // 新增的密钥信息显示元素

  // 页面加载时设置当前时间戳
  updateTimestamp();

  // 刷新时间戳按钮点击事件
  refreshTimestamp.addEventListener('click', updateTimestamp);

  // 生成签名按钮点击事件
  generateSignature.addEventListener('click', generateAPISignature);

  // 复制签名按钮点击事件
  copySignature.addEventListener('click', copySignatureToClipboard);

  // 时间戳使用选项变化事件
  useTimestamp.addEventListener('change', function() {
    // 根据复选框状态启用或禁用时间戳相关控件
    timestamp.disabled = !this.checked;
    refreshTimestamp.disabled = !this.checked;
  });

  // 更新时间戳为当前时间
  function updateTimestamp() {
    const now = Math.floor(Date.now() / 1000); // 获取秒级时间戳
    timestamp.value = now;
  }

  // 生成API签名
  function generateAPISignature() {
    const params = postParams.value.trim();
    const secretValue = secret.value.trim();
    const timestampValue = timestamp.value.trim();
    const useTimestampValue = useTimestamp.checked;
    const uppercaseValue = uppercaseSignature.checked;

    // 清除之前的错误信息
    clearError();

    // 验证输入
    if (!params) {
      showError('请输入POST参数');
      return;
    }

    if (!secretValue) {
      showError('请输入Secret');
      return;
    }

    // 如果选择了使用时间戳，则验证时间戳
    if (useTimestampValue) {
      if (!timestampValue) {
        showError('请输入时间戳');
        return;
      }

      // 验证时间戳是否为数字
      if (!/^\d+$/.test(timestampValue)) {
        showError('时间戳必须为数字');
        return;
      }
    }

    try {
      // 验证JSON格式
      JSON.parse(params);

      // 生成签名和密钥信息
      const { signature, key } = generateHMACSignature(params, secretValue, timestampValue, useTimestampValue, uppercaseValue);
      
      // 显示密钥信息和签名结果
      showKeyInfo(key, useTimestampValue);
      showSuccess(signature);
    } catch (e) {
      if (e instanceof SyntaxError) {
        showError('POST参数不是有效的JSON格式: ' + e.message);
      } else {
        showError('生成签名时出错: ' + e.message);
      }
    }
  }

  // 生成HMAC-SHA256签名
  function generateHMACSignature(data, secret, timestamp, useTimestamp, uppercase) {
    // 构造密钥: 如果使用时间戳则为 secret + timestamp，否则仅为 secret
    const key = useTimestamp ? secret + timestamp : secret;
    
    // 使用CryptoJS库生成HMAC-SHA256签名
    const hmac = CryptoJS.HmacSHA256(data, key);
    
    // 转换为十六进制字符串
    let signature = hmac.toString(CryptoJS.enc.Hex);
    
    // 根据选项决定是否转换为大写
    if (uppercase) {
      signature = signature.toUpperCase();
    } else {
      signature = signature.toLowerCase();
    }
    
    // 返回签名和密钥
    return { signature, key };
  }

  // 显示密钥信息
  function showKeyInfo(key, useTimestamp) {
    keyInfo.innerHTML = `当前算法：HMAC-SHA256，使用的密钥: ${key} ${useTimestamp ? '(secret + timestamp)' : '(仅secret)'}`;
    keyInfo.style.display = 'block';
  }

  // 显示成功结果
  function showSuccess(signature) {
    signatureResult.innerHTML = `<div class="success-result">${signature}</div>`;
    copySignature.style.display = 'inline-block';
  }

  // 显示错误信息
  function showError(message) {
    keyInfo.style.display = 'none'; // 隐藏密钥信息
    signatureResult.innerHTML = `<div class="error-message">${message}</div><div class="empty-result">点击"生成签名"按钮生成签名结果</div>`;
    copySignature.style.display = 'none';
  }

  // 清除错误信息
  function clearError() {
    const errorElement = signatureResult.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // 复制签名到剪贴板
  function copySignatureToClipboard() {
    const signatureElement = signatureResult.querySelector('.success-result');
    if (!signatureElement) {
      alert('没有可复制的签名');
      return;
    }

    const signature = signatureElement.textContent;
    
    try {
      // 使用现代Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(signature).then(() => {
          showCopySuccess();
        }).catch(() => {
          // 如果现代API失败，回退到传统方法
          fallbackCopyTextToClipboard(signature);
        });
      } else {
        // 浏览器不支持现代Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(signature);
      }
    } catch (error) {
      alert('复制失败，请手动选择签名进行复制');
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
      alert('复制失败，请手动选择签名进行复制');
    }
    
    document.body.removeChild(textArea);
  }

  // 显示复制成功提示
  function showCopySuccess() {
    const originalText = copySignature.textContent;
    copySignature.textContent = '已复制!';
    setTimeout(() => {
      copySignature.textContent = originalText;
    }, 2000);
  }
});