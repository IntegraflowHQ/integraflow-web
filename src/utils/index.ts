import { Survey } from '../types';

export function onDOMReady(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function deferSurveyActivation(
  survey: Survey,
  activateFn: (survey: Survey) => void
) {
  if (
    survey.trigger?.delay === undefined ||
    survey.trigger.delay < 0
  ) {
    return false;
  }

  console.info(
    'Deferring survey activation by ' + survey.trigger.delay
  );

  setTimeout(activateFn, survey.trigger.delay * 1000, survey);

  return true;
}
