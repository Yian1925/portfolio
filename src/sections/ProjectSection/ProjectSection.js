import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import TiltedCard from '../../components/TiltedCard/TiltedCard.jsx';
import { link } from 'framer-motion/client';

function ProjectSection() {
  const { lang } = useLanguage();

  const projects = [
    {
      title: { zh: '个人网页', en: 'Portfolio' },
      desc: { 
        zh: '利用 create-react-app 脚手架创建项目，采用react + css3 + js 构建单页面应用。使用 ReactBits 组件库、css Grid、Flexbox 实现响应式设计，确保跨设备兼容性', 
        en: 'Developed SPA with create-react-app, React + CSS3 + JS; Implemented responsive design via ReactBits, CSS Grid & Flexbox; Ensured full cross-device compatibility' 
      },
      img: '/assets/images/Project1.jpg',
      leftImg: true,
      link: 'https://github.com/xxx/xxx',
      demoLink: 'https://www.xxx.xxx/' 
    },
    {
      title: { zh: '此刻-随笔系统', en: 'Current - Note System' },
      desc: { 
        zh: '前端使用 React + React Router + css 实现动画和交互效果；后端使用 Node.js + Express 处理图片上传功能，利用 IndexedDB 和 LocalStorage实现数据持久化', 
        en: 'Developed with Python and Flask, supports article publishing, comments, and management.' 
      },
      img: '/assets/images/Project2.jpg',
      leftImg: false,
      link: 'https://github.com/xxx',
      demoLink: 'https://www.xxx.xxx/xxx' 
    },
    {
      title: { zh: '支付反插件防护', en: 'Payment Anti-Fraud Plugin / Protection' },
      desc: { 
        zh: '收集恶意插件信息并拦截，提高支付系统安全和支付转化率低的问题', 
        en: 'Detect, collect, and intercept malicious plugin data to strengthen payment system security and resolve low transaction conversion issues.' 
      },
      img: '/assets/images/Project3.jpg',
      leftImg: true,
      link: 'https://github.com/xxx/xxx',
      demoLink: '---' 
    }
  ];

  return (
    <section id="project" className="section black-bg">
      <h2>{lang === 'zh' ? '我的项目' : 'My Projects'}</h2>
      <div className="project-list">
        {projects.map((project, index) => (
          <div key={index} className={`project-item ${project.leftImg ? 'left-img' : 'right-img'}`}>
            {project.leftImg ? (
              <>
                <TiltedCard
                  imageSrc={project.img}
                  // altText={project.title[lang]}
                  captionText={project.title[lang]}
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text">
                      {project.title[lang]}
                    </p>
                  }
                />
  
                <div className="project-desc">
                  <h3>{project.title[lang]}</h3>
                  <p>{project.desc[lang]}</p>
                  <div className="project-link">
                    <span className="link-label">{lang === 'zh' ? '项目地址：' : 'Project Link: '}</span>
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {project.link}
                    </a>
                  </div>
                  <div className="project-link">
                    <span className="link-label">{lang === 'zh' ? '访问地址：' : 'Demo Link: '}</span>
                    <a href={project.demoLink} target="_blank" rel="noreferrer">
                      {project.demoLink}
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="project-desc">
                  <h3>{project.title[lang]}</h3>
                  <p>{project.desc[lang]}</p>
                  <div className="project-link">
                    <span className="link-label">{lang === 'zh' ? '项目地址：' : 'Project Link: '}</span>
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {project.link}
                    </a>
                  </div>
                  <div className="project-link">
                    <span className="link-label">{lang === 'zh' ? '访问地址：' : 'Demo Link: '}</span>
                    <a href={project.demoLink} target="_blank" rel="noreferrer">
                      {project.demoLink}
                    </a>
                  </div>
                </div>
                <TiltedCard
                  imageSrc={project.img}
                  // altText={project.title[lang]}
                  captionText={project.title[lang]}
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text">
                      {project.title[lang]}
                    </p>
                  }
                />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectSection;