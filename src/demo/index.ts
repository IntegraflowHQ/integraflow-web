import Formily from '../index';
import { templates } from './templates';

(function() {
  const formily = Formily.init({
    surveys: templates.map(t => t.survey),
    debug: true,
    onQuestionAnswered(surveyId, questionId, answers) {
      console.log(surveyId, questionId, answers);
    },
  });

  formily.showSurvey(1);
})();
