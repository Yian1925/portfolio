import React, { useRef, useState, useEffect } from 'react';

function FloatBall() {
  const ballRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false); 

  // 生成随机初始位置
  useEffect(() => {
    const generateRandomPosition = () => {
      const maxX = window.innerWidth - 80; 
      const maxY = window.innerHeight - 80; 
      
      // 避免在导航栏附近生成（导航栏高度约 80px）
      const minY = 100;
      const availableY = maxY - minY;
      
      return {
        x: Math.random() * maxX,
        y: minY + Math.random() * availableY
      };
    };

    setPosition(generateRandomPosition());
  }, []); // 只在组件挂载时执行一次

  // 处理鼠标按下事件
  const handleMouseDown = (e) => {
    e.preventDefault(); // 防止默认行为
    setHasMoved(false); // 重置移动状态
    const rect = ballRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const moveDistance = Math.abs(e.clientX - (rect.left + offsetX)) + 
                          Math.abs(e.clientY - (rect.top + offsetY));
      
      if (moveDistance > 3) { // 降低移动阈值
        setIsDragging(true);
        setHasMoved(true);
      }
      
      // 计算新位置，确保跟随鼠标
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // 限制浮标不出窗口
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setPosition({
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
      });
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = ''; // 恢复文字选择
      
      // 延迟重置拖拽状态
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    };

    document.body.style.userSelect = 'none'; // 防止选中文字
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 处理点击事件
  const handleClick = (e) => {
    // 只有在没有移动过且没有拖拽时才执行跳转
    if (!hasMoved && !isDragging) {
      console.log('点击跳转！');
      window.open('/yuexiake/index.html', '_blank');
    }
  };

  return (
    <div
      ref={ballRef}
      id="float-ball"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      title="跳转"
    >
      <img 
        src="/assets/images/小狗头像.jpg" 
        alt="浮动球"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default FloatBall;