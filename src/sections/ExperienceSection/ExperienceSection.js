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
              <span className="exp-title">{lang === 'zh' ? '北京理工大学' : 'Beijing Institute of Technology'}</span>
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
                ? '信号与系统、数字信号处理、数字图像处理、随机信号分析、数据结构与算法设计、机器学习理论和实践'
                : 'Signal and System, Digital Signal Processing, Digital Image Processing, Random Signal Analysis, Data Structure and Algorithm Design, Machine Learning Theory and Practice'
              }
            </div>
          </div>
        </div>
        
        {/* Parttime */}
        <div className="exp-row">
          <div className="exp-left">
            <div className="exp-title-row">
              <img className="exp-icon" src="/assets/images/京东健康.webp" alt="京东健康" />
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
                ? '负责产品的Web端、移动端、小程序的功能测试、接口测试、性能测试、兼容性测试、弱网测试、线上监控等，独立完成分配的测试工作，确保20+个产品顺利上线。参与项目测试的全流程，有效执行测试计划，及时跟踪验证BUG，确保产品顺利上线并进行回归测试'
                : 'Responsible for functional testing, API testing, performance testing, compatibility testing, weak network testing, and online monitoring of Web, mobile, and mini-program products. Independently completed assigned testing work, ensuring the successful launch of 20+ products. Participated in the full process of project testing, effectively executed test plans, and tracked and verified BUGs in a timely manner to ensure smooth product launch and regression testing'
              }
            </div>
          </div>
        </div>
        
        {/* Fulltime */}
        <div className="exp-row">
          <div className="exp-left">
            <div className="exp-title-row">
              <img className="exp-icon" src="/assets/images/准动.jpg" alt="厦门准动网络" />
              <span className="exp-title">{lang === 'zh' ? '厦门准动网络' : 'Xiamen Zhundong Network'}</span>
            </div>
            <div className="exp-type-row">
              <span className="exp-type">{lang === 'zh' ? '全职' : 'Full-time'}</span>
            </div>
            <div className="exp-info-row">
              <span className="exp-identity">{lang === 'zh' ? '测试工程师' : 'Test Engineer'}</span>
              <span className="exp-time">2023.11-2024.5</span>
            </div>
          </div>
          <div className="exp-right">
            <div className="exp-desc">
              {lang === 'zh' 
                ? '负责银豹客户端、web端的接口测试、功能测试等，在单接口自动化的基础上实现场景自动化提高测试效率以及业务测试用例覆盖率。根据抓包结果以及后端日志辅助定位缺陷产生原因，累计跟进测试项目30+。整理项目的技术文档及业务逻辑文档，编写相关流程图。维护TAPD系统测试文档，累计录入2000+测试用例'
                : 'Responsible for API testing and functional testing of Yinbao client and web applications. Implemented scenario automation based on single interface automation to improve testing efficiency and business test case coverage. Assisted in locating defect causes based on packet capture results and backend logs, cumulatively following up on 30+ test projects. Organized project technical documentation and business logic documentation, and wrote related flowcharts. Maintained TAPD system test documentation with over 2000 test cases'
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;