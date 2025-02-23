import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { SharpDark, SharpLight } from 'survey-core/themes';
import { useState,useEffect } from 'react';
import { surveyJSON } from '@/components/survey_json'; // Import the survey JSON from the file
import { useTheme } from 'next-themes';

export default function SurveyForm() {
  const {theme,setTheme} = useTheme();
  const [isDarkMode,setIsDarkMode] = useState(false);
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark').matches;
    setIsDarkMode(theme === 'dark' || (theme === 'system' && systemDark));
  }, [theme]);

  const model = new Model(surveyJSON);
  useEffect(() => {
    if (isDarkMode) {
      model.applyTheme(SharpDark);
    } else {
      model.applyTheme(SharpLight);
    }
  }, [isDarkMode, model]);   
  return <Survey model={model}/>;
}