import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

function Navbar() {
  const { lang, setLang } = useLanguage();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="#personal" className="nav-logo">
          <img src="/assets/images/卡通头像.jpg" alt="logo" className="nav-logo-icon" />
          <span>{lang === 'zh' ? '主页' : 'Personal'}</span>
        </a>
        <ul className="nav-menu">
          <li><a href="#about">{lang === 'zh' ? '个人经历' : 'My Experience'}</a></li>
          <li><a href="#skills">{lang === 'zh' ? '个人技能' : 'Skills'}</a></li>
          <li><a href="#project">{lang === 'zh' ? '项目' : 'Project'}</a></li>
          <li><a href="#contact">{lang === 'zh' ? '联系我' : 'Contact Me'}</a></li>
        </ul>
      </div>
      <div className="nav-right">
        <button 
          className={lang === 'zh' ? 'lang-btn active' : 'lang-btn'}
          onClick={() => setLang('zh')}
        >
          中文
        </button>
        <button 
          className={lang === 'en' ? 'lang-btn active' : 'lang-btn'}
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 