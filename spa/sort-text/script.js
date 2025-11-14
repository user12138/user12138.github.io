document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput');
  const sortButton = document.getElementById('sortButton');
  const sortTypeInputs = document.getElementsByName('sortType');

  // 排序按钮点击事件
  sortButton.addEventListener('click', sortText);

  // 文本排序主函数
  function sortText() {
    const text = textInput.value.trim();

    // 验证输入
    if (!text) {
      alert('请输入要排序的文本');
      return;
    }

    try {
      // 获取选中的排序方式
      const selectedSortType = getSelectedSortType();

      // 将文本按行分割成数组
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length === 0) {
        alert('没有有效的文本行');
        return;
      }

      // 根据选择的排序方式进行排序
      const sortedLines = sortLines(lines, selectedSortType);

      // 直接在输入框中显示排序结果
      textInput.value = sortedLines.join('\n');
    } catch (error) {
      alert('排序过程中出现错误：' + error.message);
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
});