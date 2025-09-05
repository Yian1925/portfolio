import React from 'react';
// import './ThemeSwitcher.css';

const themes = [
  { id: 'default', name: '默认' },
  { id: 'pink', name: '淡粉色' },
  { id: 'blue', name: '奶蓝色' },
  { id: 'yellow', name: '奶油黄' },
  { id: 'green', name: '奶绿色' }
];

export const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  const handleThemeSwitch = () => {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    onThemeChange(nextTheme.id);
  };

  return (
    <div className="theme-switcher">
      <button
        className="theme-switch-btn"
        onClick={handleThemeSwitch}
        title={`当前主题：${currentThemeData.name} | 点击切换`}
      >
        <span>切换主题</span>
      </button>
    </div>
  );
};
