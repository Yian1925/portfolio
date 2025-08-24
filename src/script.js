// 语言切换功能
const btnZh = document.getElementById('lang-zh');
const btnEn = document.getElementById('lang-en');
let currentLang = 'zh'; // 默认中文

function setLang(lang) {
  currentLang = lang;
  btnZh.classList.toggle('active', lang === 'zh');
  btnEn.classList.toggle('active', lang === 'en');
  document.querySelectorAll('[data-zh]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
}
btnZh.addEventListener('click', () => setLang('zh'));
btnEn.addEventListener('click', () => setLang('en'));
// 技能点击变色
// document.querySelectorAll('.skill-item').forEach(item => {
//   item.addEventListener('click', function() {
//     this.classList.toggle('active');
//   });
// });
// 浮标拖拽功能
const floatBall = document.getElementById('float-ball');
let isDragging = false;
let offsetX, offsetY;

floatBall.addEventListener('mousedown', function(e) {
  isDragging = true;
  // 鼠标在浮标内的偏移
  offsetX = e.clientX - floatBall.getBoundingClientRect().left;
  offsetY = e.clientY - floatBall.getBoundingClientRect().top;
  floatBall.style.transition = 'none';
  document.body.style.userSelect = 'none'; // 防止选中文字
});

document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    // 限制浮标不出窗口
    const minX = 0, minY = 0;
    const maxX = window.innerWidth - floatBall.offsetWidth;
    const maxY = window.innerHeight - floatBall.offsetHeight;
    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));
    floatBall.style.left = x + 'px';
    floatBall.style.top = y + 'px';
    floatBall.style.right = 'auto';
    floatBall.style.bottom = 'auto';
    floatBall.style.position = 'fixed';
  }
});

document.addEventListener('mouseup', function() {
  if (isDragging) {
    isDragging = false;
    floatBall.style.transition = '';
    document.body.style.userSelect = '';
  }
});

// 防止拖拽时触发跳转
floatBall.addEventListener('click', function(e) {
  if (isDragging) {
    e.preventDefault();
  }
});
