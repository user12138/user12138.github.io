document.addEventListener('DOMContentLoaded', function () {
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('fileInput');
  const browseButton = document.getElementById('browseButton');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const fileType = document.getElementById('fileType');
  const calculateButton = document.getElementById('calculateButton');
  const hashResult = document.getElementById('hashResult');
  const algorithmCheckboxes = document.querySelectorAll('input[name="algorithms"]');

  let selectedFile = null;

  // 事件监听器
  browseButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  calculateButton.addEventListener('click', calculateHashes);

  // 拖拽事件
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add('dragover');
  }

  function unhighlight() {
    dropArea.classList.remove('dragover');
  }

  // 处理文件拖拽
  dropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // 处理文件选择
  function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
  }

  // 处理文件
  function handleFiles(files) {
    if (files.length > 0) {
      selectedFile = files[0];
      displayFileInfo(selectedFile);
    }
  }

  // 显示文件信息
  function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.type || '未知';
    fileInfo.style.display = 'block';
  }

  // 格式化文件大小
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 获取选中的算法
  function getSelectedAlgorithms() {
    const selected = [];
    algorithmCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    });
    return selected;
  }

  // 计算哈希值
  async function calculateHashes() {
    if (!selectedFile) {
      showError('请先选择一个文件');
      return;
    }

    const algorithms = getSelectedAlgorithms();
    if (algorithms.length === 0) {
      showError('请至少选择一个哈希算法');
      return;
    }

    // 显示进度条
    showProgress(0);

    try {
      // 清除之前的错误信息
      clearError();

      // 禁用计算按钮
      calculateButton.disabled = true;
      calculateButton.textContent = '计算中...';

      // 计算每个算法的哈希值
      const results = {};
      for (let i = 0; i < algorithms.length; i++) {
        const algorithm = algorithms[i];
        const hash = await calculateHash(selectedFile, algorithm);
        results[algorithm] = hash;
        
        // 更新进度
        const progress = ((i + 1) / algorithms.length) * 100;
        showProgress(progress);
      }

      // 显示结果
      showResults(results);
    } catch (error) {
      showError('计算哈希值时出错：' + error.message);
    } finally {
      // 启用计算按钮
      calculateButton.disabled = false;
      calculateButton.textContent = '计算哈希';
      
      // 隐藏进度条
      hideProgress();
    }
  }

  // 计算单个算法的哈希值
  function calculateHash(file, algorithm) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
          let hash;
          
          switch (algorithm) {
            case 'MD5':
              hash = CryptoJS.MD5(wordArray).toString();
              break;
            case 'SHA1':
              hash = CryptoJS.SHA1(wordArray).toString();
              break;
            case 'SHA256':
              hash = CryptoJS.SHA256(wordArray).toString();
              break;
            case 'SHA512':
              hash = CryptoJS.SHA512(wordArray).toString();
              break;
            case 'SHA3-256':
              hash = CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString();
              break;
            case 'SHA3-512':
              hash = CryptoJS.SHA3(wordArray, { outputLength: 512 }).toString();
              break;
            default:
              reject(new Error('不支持的算法：' + algorithm));
              return;
          }
          
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = function() {
        reject(new Error('读取文件时出错'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  // 显示进度
  function showProgress(percent) {
    let progressContainer = document.querySelector('.progress-container');
    if (!progressContainer) {
      progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container';
      hashResult.parentNode.insertBefore(progressContainer, hashResult);
    }
    
    progressContainer.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <div class="progress-text">计算进度: ${Math.round(percent)}%</div>
    `;
  }

  // 隐藏进度
  function hideProgress() {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
      progressContainer.remove();
    }
  }

  // 显示结果
  function showResults(results) {
    let tableHtml = `
      <table class="hash-result-table">
        <thead>
          <tr>
            <th>算法</th>
            <th>哈希值</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    for (const [algorithm, hash] of Object.entries(results)) {
      tableHtml += `
        <tr>
          <td class="algorithm-name">${algorithm}</td>
          <td class="hash-value">${hash}</td>
          <td class="copy-cell">
            <button class="copy-button" data-algorithm="${algorithm}" data-hash="${hash}">复制</button>
          </td>
        </tr>
      `;
    }
    
    tableHtml += `
        </tbody>
      </table>
    `;
    
    hashResult.innerHTML = tableHtml;
    
    // 为复制按钮添加事件监听器
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
      button.addEventListener('click', copyRowToClipboard);
    });
  }

  // 复制特定行到剪贴板
  function copyRowToClipboard(event) {
    const button = event.target;
    const hash = button.getAttribute('data-hash');
    
    try {
      // 使用现代Clipboard API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(hash).then(() => {
          showCopySuccess(button);
        }).catch(() => {
          // 如果现代API失败，回退到传统方法
          fallbackCopyTextToClipboard(hash, button);
        });
      } else {
        // 浏览器不支持现代Clipboard API，使用传统方法
        fallbackCopyTextToClipboard(hash, button);
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
    }, 2000);
  }

  // 显示错误信息
  function showError(message) {
    hashResult.innerHTML = `<div class="error-message">${message}</div><div class="empty-result">计算后的哈希值将显示在这里</div>`;
  }

  // 清除错误信息
  function clearError() {
    const errorElement = hashResult.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
});