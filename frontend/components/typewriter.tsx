'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  phrases?: string[];
  text?: string;
  prefix?: string;
  speed?: number;
  eraseSpeed?: number;
  delayAfterPhrase?: number;
  delayBeforeErasing?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  phrases = [], 
  text = 'Use EchoAce to ', 
  prefix = '',
  speed = 50,
  eraseSpeed = 20,
  delayAfterPhrase = 1500,
  delayBeforeErasing = 1000
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const phrasesToUse = phrases.length > 0 ? phrases : [text];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentPhrase = phrasesToUse[currentPhraseIndex];

    if (isTyping) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterPhrase);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, eraseSpeed);
      } else {
        const nextPhraseIndex = (currentPhraseIndex + 1) % phrasesToUse.length;
        setCurrentPhraseIndex(nextPhraseIndex);
        setIsTyping(true);
        timeout = setTimeout(() => {}, delayBeforeErasing);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentPhraseIndex, isTyping, phrasesToUse, speed, eraseSpeed, delayAfterPhrase, delayBeforeErasing]);

  return <span>{prefix}{displayText}</span>;
};

export default Typewriter;