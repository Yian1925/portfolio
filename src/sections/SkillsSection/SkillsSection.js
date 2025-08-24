import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FadeContent from '../../components/FadeContent/FadeContent.jsx';

function SkillsSection() {
  const { lang } = useLanguage();

  const skills = [
    { name: { zh: 'Python', en: 'Python' }, icon: '/assets/icon/Python-icon.png' },
    { name: { zh: 'JMeter', en: 'JMeter' }, icon: '/assets/icon/Jmeter-icon.png' },
    { name: { zh: 'Postman', en: 'Postman' }, icon: '/assets/icon/Postman-icon.png' },
    { name: { zh: 'Selenium', en: 'Selenium' }, icon: '/assets/icon/Selenium-icon.png' },
    { name: { zh: '功能测试', en: 'Functional Testing' }, icon: '/assets/icon/Fun-click.png' },
    { name: { zh: '自动化测试', en: 'Automated Testing' }, icon: '/assets/icon/Auto-toolkit.png' },
    { name: { zh: 'Git', en: 'Git' }, icon: '/assets/icon/Git-icon.png' },
    { name: { zh: 'MySQL', en: 'MySQL' }, icon: '/assets/icon/MySQL-icon.png' },
    { name: { zh: 'Linux', en: 'Linux' }, icon: '/assets/icon/Linux-icon.png' }
  ];

  return (
    <section id="skills" className="section white-bg">
      <h2>{lang === 'zh' ? '我的技能' : 'My Skills'}</h2>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <div className="skill-item">
              <img className="skill-icon" src={skill.icon} alt={skill.name[lang]} />
              <div className="skill-title">{skill.name[lang]}</div>
            </div>
          </FadeContent>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;