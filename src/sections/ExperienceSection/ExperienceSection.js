import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

function ExperienceSection() {
  const { lang } = useLanguage();

  return (
    <section id="about" className="section black-bg">
      <h2>{lang === 'zh' ? '个人经历' : 'My Experience'}</h2>
      <div className="exp-list">
        {/* Education */}
        <div className="exp-row">
          <div className="exp-left">
            <div className="exp-title-row">
              <img className="exp-icon" src="/assets/images/校徽.webp" alt="北京理工大学校徽" />
              <span className="exp-title">{lang === 'zh' ? 'xx大学' : 'xxx'}</span>
            </div>
            <div className="exp-type-row">
              <span className="exp-type">{lang === 'zh' ? '本科' : "Bachelor's Degree"}</span>
            </div>
            <div className="exp-info-row">
              <span className="exp-identity">{lang === 'zh' ? '生物医学工程' : 'Biomedical Engineering'}</span>
              <span className="exp-time">2019.9-2023.6</span>
            </div>
          </div>
          <div className="exp-right">
            <div className="exp-desc">
              {lang === 'zh' 
                ? '主修课程：\n●  信号与系统、数字信号处理、数字图像处理、随机信号分析、数据结构与算法设计、机器学习理论和实践...'
                : 'Major Courses:\n●  Signal and System, Digital Signal Processing, Digital Image Processing, Random Signal Analysis, Data Structure and Algorithm Design, Machine Learning Theory and Practice'
              }
            </div>
          </div>
        </div>
        
        {/* Parttime */}
        <div className="exp-row">
          <div className="exp-left">
            <div className="exp-title-row">
              <img className="exp-icon" src="/assets/images/京东健康.webp" alt="xxx" />
              <span className="exp-title">{lang === 'zh' ? '京东健康' : 'JD Health'}</span>
            </div>
            <div className="exp-type-row">
              <span className="exp-type">{lang === 'zh' ? '实习' : 'Internship'}</span>
            </div>
            <div className="exp-info-row">
              <span className="exp-identity">{lang === 'zh' ? '测试开发工程师' : 'Test Development Engineer'}</span>
              <span className="exp-time">2022.10-2023.4</span>
            </div>
          </div>
          <div className="exp-right">
            <div className="exp-desc">
              {lang === 'zh' 
                ? '主要职责：\n●  负责产品的Web端、移动端、小程序的功能测试、接口测试、性能测试、兼容性测试、弱网测试、线上监控等\n●  独立完成分配的测试工作，确保20+个产品顺利上线'
                : 'Responsibilities:\n●  Conducted functional, API, performance, compatibility, low-network, and production monitoring tests for web, mobile, and mini-program products\n●  Independently managed testing for 20+ product launches'
              }
            </div>
          </div>
        </div>
        
        {/* Fulltime */}
        <div className="exp-row">
          <div className="exp-left">
            <div className="exp-title-row">
              <img className="exp-icon" src="/assets/images/京东健康.webp" alt="xx" />
              <span className="exp-title">{lang === 'zh' ? 'xxx' : 'xx Network'}</span>
            </div>
            <div className="exp-type-row">
              <span className="exp-type">{lang === 'zh' ? '全职' : 'Full-time'}</span>
            </div>
            <div className="exp-info-row">
              <span className="exp-identity">{lang === 'zh' ? '测试工程师' : 'Test Engineer'}</span>
              <span className="exp-time">2023.11-2025.5</span>
            </div>
          </div>
          <div className="exp-right">
            <div className="exp-desc">
              {lang === 'zh' 
                ? '主要职责：\n●  负责xx客户端、web端的接口测试、功能测试等，在单接口自动化的基础上实现场景自动化提高测试效率以及业务测试用例覆盖率\n●  根据抓包结果以及后端日志辅助定位缺陷产生原因，累计跟进测试项目30+'
                : 'Responsibilities:\n●  Developed scenario-based automation on top of single-interface automation to improve testing efficiency and business test coverage for Yibao client and web platforms\n●  Analyzed packet capture results and backend logs to identify root causes of defects, supporting 30+ test projects'
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;