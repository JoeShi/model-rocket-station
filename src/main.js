// 导入 Material Web 组件
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/text-button.js';
import '@material/web/labs/card/elevated-card.js';
import '@material/web/labs/card/filled-card.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  console.log('模型火箭站应用已加载');
  
  // 示例：为按钮添加点击事件
  const exploreButton = document.querySelector('md-filled-tonal-button');
  if (exploreButton) {
    exploreButton.addEventListener('click', () => {
      alert('欢迎来到模型火箭站！');
    });
  }
});