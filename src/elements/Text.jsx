import React from 'react'

const Text = ({ children, st = {} }) => {
  return (
    <p style={{ color: 'black', ...st }}>
      {children}
    </p>
  );
};

export default Text
