import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
    <div className="footer-left">
      <img src="/assets/images/无外框卡通头像.jpg" alt='footer icon' className='footer-icon'></img>
      <span className="footer-title">Personal</span>
    </div>
    <div className="footer-right">
      <div className="footer-link">@我的网站</div>
      <div className="footer-link">隐私政策</div>
      <div className="footer-link">支持名单</div>
    </div>
  </footer>
  );
}

export default Footer;