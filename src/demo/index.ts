import Formily from '../index';
import { templates } from './templates';

(function() {
  const formily = Formily.init({
    surveys: templates.map(t => t.survey),
    debug: true
  });

  formily.showSurvey(1);
})();
