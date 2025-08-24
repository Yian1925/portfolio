import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import TiltedCard from '../../components/TiltedCard/TiltedCard.jsx';

function ProjectSection() {
  const { lang } = useLanguage();

  const projects = [
    {
      title: { zh: '自动化测试平台', en: 'Automation Testing Platform' },
      desc: { 
        zh: '负责平台的接口测试模块开发，实现一键测试与报告生成。', 
        en: 'Responsible for API testing module, implemented one-click testing and report generation.' 
      },
      img: '/assets/images/Project1.jpg',
      leftImg: true,
      link: 'https://github.com/yourname/project1'
    },
    {
      title: { zh: '个人博客系统', en: 'Personal Blog System' },
      desc: { 
        zh: '基于Python和Flask开发，实现文章发布、评论与管理功能。', 
        en: 'Developed with Python and Flask, supports article publishing, comments, and management.' 
      },
      img: '/assets/images/Project2.jpg',
      leftImg: false,
      link: 'https://github.com/yourname/project2'
    },
    {
      title: { zh: '数据可视化大屏', en: 'Data Visualization Dashboard' },
      desc: { 
        zh: '使用Echarts和Vue实现多维度数据展示与交互。', 
        en: 'Implemented with Echarts and Vue for multidimensional data display and interaction.' 
      },
      img: '/assets/images/Project3.jpg',
      leftImg: true,
      link: 'https://github.com/yourname/project3'
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