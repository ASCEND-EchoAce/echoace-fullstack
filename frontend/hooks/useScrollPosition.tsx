'use client';

import { useEffect, useState } from 'react';

type ScrollPosition = {
  yOffset: number;
  xOffset: number;
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    yOffset: 0,
    xOffset: 0
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({ yOffset: window.pageYOffset, xOffset: window.pageXOffset });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
