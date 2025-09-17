import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import RotatingText from '../../components/RotatingText/RotatingText.jsx';

function ContactSection() {
  const { lang } = useLanguage();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // 自动隐藏toast
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 2000); // 2秒后自动消失

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const validateForm = () => {
    const newErrors = {};
    
    // 验证姓名（必填）
    if (!formData.name.trim()) {
      newErrors.name = lang === 'zh' ? '请输入姓名' : 'Please enter your name';
    }
    
    // 验证消息（必填）
    if (!formData.message.trim()) {
      newErrors.message = lang === 'zh' ? '请输入消息内容' : 'Please enter your message';
    }
    
    // 验证邮箱（可选，但如果填写了就要验证格式）
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      newErrors.email = lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('https://getform.io/f/bwnyyqna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitMessage(lang === 'zh' ? '发送成功啦！' : 'Message sent successfully!');
        // 清空表单
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitMessage(lang === 'zh' ? '发送失败了，请稍后重试哦～' : 'Failed to send message, please try again～');
      }
    } catch (error) {
      console.error('提交错误:', error);
      setSubmitMessage(lang === 'zh' ? '发送失败了，请稍后重试哦～' : 'Failed to send message, please try again～');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section white-bg">
      <div className="contact-section">
        {/* contact-title */}
        <div className="contact-title">
          <h3>
            Let's Create
            <RotatingText
              texts={['Blogs!', 'Code!', 'Value!', 'Joy!', 'Crafts!', 'Paintings!']}
              mainClassName="rotating-text-bg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              onNext={(index) => {
                console.log('文字动画切换到第', index, '个文本');
              }}
            />
          </h3>
        </div>

        {/* contact-content */}
        <div className="contact-content">
          {/* contact-form */}
          <div className="contact-form">
            <form onSubmit={handleSubmit} noValidate style={{ position: 'relative' }}>
              <div>
                <input 
                  type="text" 
                  placeholder={lang === 'zh' ? '姓名' : 'Name'} 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder={lang === 'zh' ? '邮箱' : 'Email'} 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <div>
                <textarea 
                  id="message" 
                  placeholder={lang === 'zh' ? '消息内容' : 'Message'} 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <div className="error-message">{errors.message}</div>}
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={isSubmitting ? 'submitting' : ''}
                >
                  {isSubmitting 
                    ? (lang === 'zh' ? '发送中...' : 'Sending...') 
                    : (lang === 'zh' ? '联系我' : 'Get In Touch')
                  }
                </button>
              </div>
              
              {/* Toast 提示 - 在表单内 */}
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('成功') || submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
          
          {/* contact-info */}
          <div className="contact-info">
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-details">
                  <span className="contact-label">{lang === 'zh' ? '邮箱：' : 'Email: '}</span>
                  <a href="mailto:xxx@xxx.com">xxx@xxx.com</a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-details">
                  <span className="contact-label">{lang === 'zh' ? '电话：' : 'Phone: '}</span>
                  <span>123456789</span>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-details">
                  <span className="contact-label">GitHub: </span>
                  <a href="https://github.com/xxx" target="_blank" rel="noreferrer">github.com/xxx</a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-details">
                  <span className="contact-label">Gitee: </span>
                  <a href="https://gitee.com/xxx" target="_blank" rel="noreferrer">gitee.com/xxx</a>
                </div>
              </div>
            </div>
            
            {/* contact-icon-boxes */}
            <div className="contact-icon-boxes">
              <a href="mailto:xxx@xxx.com" className="icon-box">
                <img src="/assets/icon/Email-icon.png" alt="Email" />
              </a>
              <div className="icon-box">
                <img src="/assets/icon/Phone-icon.png" alt="Phone" />
              </div>
              <a href="https://github.com/xxx" target="_blank" rel="noreferrer" className="icon-box">
                <img src="/assets/icon/Github-icon.png" alt="GitHub" />
              </a>
              <a href="https://www.notion.so/xxx" target="_blank" rel="noreferrer" className="icon-box">
                <img src="/assets/icon/Notion-icon.png" alt="Notion" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;