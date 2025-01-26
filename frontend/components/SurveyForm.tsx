import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { SharpDark } from 'survey-core/themes';
import { surveyJSON } from './improved_survey_json'; // Import the survey JSON from the file

const json = {
  elements: [
    {
      name: 'FirstName',
      title: 'Enter your first name:',
      type: 'text'
    },
    {
      name: 'LastName',
      title: 'Enter your last name:',
      type: 'text'
    }
  ]
};
export default function SurveyForm() {
  const model = new Model(surveyJSON);
  model.applyTheme(SharpDark);
  return <Survey model={model}></Survey>;
}