document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput');
  const delimiterSelect = document.getElementById('delimiterSelect');
  const customDelimiter = document.getElementById('customDelimiter');
  const convertButton = document.getElementById('convertButton');
  const copyButton = document.getElementById('copyButton');
  const resultContainer = document.getElementById('resultContainer');

  // 分隔符选项变化处理
  delimiterSelect.addEventListener('change', function () {
    if (this.value === 'custom') {
      customDelimiter.style.display = 'inline-block';
      customDelimiter.focus();
    } else {
      customDelimiter.style.display = 'none';
    }
  });

  // 转换按钮点击处理
  convertButton.addEventListener('click', convertTextToTable);

  // 自定义分隔符输入处理
  customDelimiter.addEventListener('input', function () {
    if (this.value.length > 1) {
      this.value = this.value.slice(0, 1);
    }
  });

  // 复制按钮点击处理
  copyButton.addEventListener('click', copyTableToClipboard);

  // 回车键触发转换
  textInput.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') {
      convertTextToTable();
    }
  });

  // 文本转表格主函数
  function convertTextToTable() {
    const text = textInput.value.trim();
    
    if (!text) {
      showError('请输入要转换的文本');
      return;
    }

    try {
      // 获取分隔符
      let delimiter = ',';
      switch (delimiterSelect.value) {
        case 'comma':
          delimiter = ',';
          break;
        case 'tab':
          delimiter = '\t';
          break;
        case 'semicolon':
          delimiter = ';';
          break;
        case 'pipe':
          delimiter = '|';
          break;
        case 'space':
          delimiter = ' ';
          break;
        case 'custom':
          const custom = customDelimiter.value;
          if (!custom) {
            showError('请指定自定义分隔符');
            return;
          }
          delimiter = custom;
          break;
      }

      // 解析文本为行
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        showError('没有有效的数据行');
        return;
      }

      // 解析每行为单元格
      const tableData = lines.map(line => {
        // 处理引号包围的字段（如 CSV 格式）
        if (delimiter === ',' && (line.includes('"') || line.includes("'"))) {
          return parseCSVLine(line);
        }
        return line.split(delimiter);
      });

      // 生成表格
      const tableHTML = generateTableHTML(tableData);
      resultContainer.innerHTML = tableHTML;
      copyButton.style.display = 'inline-block';
    } catch (error) {
      showError('转换过程中出现错误：' + error.message);
    }
  }

  // 解析 CSV 行（处理引号）
  function parseCSVLine(line) {
    const cells = [];
    let cell = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        // 检查是否是转义引号
        if (i + 1 < line.length && line[i + 1] === quoteChar) {
          cell += quoteChar;
          i++; // 跳过下一个引号
        } else {
          inQuotes = false;
          quoteChar = '';
        }
      } else if (!inQuotes && char === ',') {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }

    cells.push(cell.trim());
    return cells;
  }

  // 生成表格 HTML
  function generateTableHTML(data) {
    if (!data || data.length === 0) {
      return '<div class="empty-result">没有数据可显示</div>';
    }

    let html = '<table class="result-table">';
    
    // 表头
    html += '<thead><tr>';
    const headerCells = data[0];
    headerCells.forEach((cell, index) => {
      html += `<th>列 ${index + 1}${cell ? ` (${cell})` : ''}</th>`;
    });
    html += '</tr></thead>';
    
    // 数据行
    html += '<tbody>';
    for (let i = 1; i < data.length; i++) {
      html += '<tr>';
      const rowCells = data[i];
      const maxCols = Math.max(headerCells.length, rowCells.length);
      
      for (let j = 0; j < maxCols; j++) {
        const cellValue = j < rowCells.length ? rowCells[j] : '';
        html += `<td>${escapeHtml(cellValue)}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    
    return html;
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
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
  }

  // 显示错误信息
  function showError(message) {
    resultContainer.innerHTML = `<div class="error-message">${message}</div><div class="empty-result">转换后的表格将显示在这里</div>`;
    copyButton.style.display = 'none';
  }

  // 复制表格到剪贴板
  function copyTableToClipboard() {
    const table = resultContainer.querySelector('.result-table');
    if (!table) {
      alert('没有可复制的表格');
      return;
    }

    try {
      // 创建临时 textarea 来复制内容
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = tableToText(table);
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextarea);
      
      // 显示提示信息
      const originalText = copyButton.textContent;
      copyButton.textContent = '已复制!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } catch (error) {
      alert('复制失败，请手动选择表格内容进行复制');
    }
  }

  // 将表格转换为文本格式
  function tableToText(table) {
    let text = '';
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      const cellValues = [];
      
      cells.forEach(cell => {
        // 移除 HTML 标签并还原换行符
        let cellText = cell.innerHTML
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '');
        cellValues.push(cellText);
      });
      
      text += cellValues.join('\t');
      if (rowIndex < rows.length - 1) {
        text += '\n';
      }
    });
    
    return text;
  }
});