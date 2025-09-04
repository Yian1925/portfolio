import React from 'react';

export const BackgroundLayer = ({ backgroundImage }) => {
  return (
    <div 
      className="background-layer"
      style={{
        backgroundImage: `url(${backgroundImage.startsWith('data:') ? backgroundImage : process.env.PUBLIC_URL + backgroundImage})`
      }}
    />
  );
};
