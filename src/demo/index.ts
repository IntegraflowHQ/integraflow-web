import IntegraFlow from '../index';
import { templates } from './templates';

(function() {
  const integraFlow = IntegraFlow.init({
    surveys: templates.map(t => t.survey),
    debug: true,
    onQuestionAnswered(surveyId, questionId, answers) {
      console.log(surveyId, questionId, answers);
    },
  });

  integraFlow.showSurvey(1);
})();
