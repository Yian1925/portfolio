import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import SplitText from '../../components/SplitText/SplitText.jsx';


function PersonalSection() {
  const { lang } = useLanguage();

  const handleAnimationComplete = () => {
    console.log('文字动画1完成！');
  };
  console.log('当前语言:', lang);

  return (
    <section id="personal" className="section white-bg">
      <div className="personal-content">
        <div className="personal-text">
          {/* 标题文字动画 */}
          <h1 className="personal-introduce">
            <SplitText
              key={`title-${lang}`}
              text={lang === 'zh' ? '你好啊！' : "Hello, I'm Charlotte!"}
              className="text-3xl font-bold"
              delay={100}
              duration={0.8}
              ease="power3.out"
              splitType="chars" 
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="left"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </h1>
          
          {/* 段落文字动画 - 根据语言动态设置分割方式 */}
          <div className="personal-mb4">
            <SplitText
              key={`desc-${lang}`}
              text={lang === 'zh' 
                ? '欢迎访问我的个人网站！在这里你可以看到我的教育背景，工作经历，个人技能，以及一些项目经验，当然了，还有那些让我两眼放光的兴趣！请随意参观～'
                : 'Welcome to my personal website! Here, you can explore my educational background, professional experience, technical skills, and project portfolio—along with some of my passions that truly spark my curiosity. Feel free to browse around!'
              }
              className="text-lg leading-relaxed"
              delay={200}
              duration={0.4}
              ease="power2.out"
              splitType={lang === 'zh' ? 'chars' : 'words'} // 中文用字符，英文用单词
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </div>
        </div>
        <div className="personal-img">
          <a href="/comic" target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/人物卡通形象.jpg" alt="个人形象" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default PersonalSection;