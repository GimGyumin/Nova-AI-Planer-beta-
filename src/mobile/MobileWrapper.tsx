import React from 'react';

// MobileWrapper: legacy wrapper removed `.m` class dependency.
// It now only ensures mobile CSS is loaded (mobile.css uses media queries)
export const MobileWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default MobileWrapper;
