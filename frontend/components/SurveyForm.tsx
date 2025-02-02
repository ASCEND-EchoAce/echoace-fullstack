import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { SharpDark } from 'survey-core/themes';
import { surveyJSON } from './survey'; // Import the survey JSON from the file

export default function SurveyForm() {
  const model = new Model(surveyJSON);
  model.applyTheme(SharpDark);
  return <Survey model={model}></Survey>;
}
