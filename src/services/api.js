const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('图片上传失败');
  }

  return response.json();
};

export const saveLayout = async (layoutData) => {
  const response = await fetch(`${API_BASE_URL}/save-layout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(layoutData),
  });

  if (!response.ok) {
    throw new Error('布局保存失败');
  }

  return response.json();
};

export const getLayout = async () => {
  const response = await fetch(`${API_BASE_URL}/get-layout`);
  
  if (!response.ok) {
    throw new Error('获取布局失败');
  }

  return response.json();
};