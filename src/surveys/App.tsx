import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';

import { Wrapper } from '../components';
import { ID, Survey, SurveyAnswer } from '../types';
import SurveyView from './components/Survey';

interface AppProps {
  survey: Survey;
  onSurveyDisplayed?: (surveyId: ID) => void;
  onSurveyClosed?: (surveyId: ID) => Promise<void>;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answer: SurveyAnswer
  ) => void;
  onSurveyCompleted?: (surveyId: ID) => void;
}

export default function App({
  survey,
  onSurveyDisplayed,
  onSurveyClosed,
  onQuestionAnswered,
  onSurveyCompleted,
}: AppProps): VNode {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      onSurveyClosed?.(survey.id);
    }, 1000); // wait for animation to finish
  };

  return (
    <div id='fbjs'>
      <Wrapper
        // isOpen={isOpen}
        close={close}
        placement={survey.settings.placement}
        background={survey.theme?.background}
      >
        <SurveyView
          survey={survey}
          close={close}
          onSurveyDisplayed={onSurveyDisplayed}
          onQuestionAnswered={onQuestionAnswered}
          onSurveyCompleted={onSurveyCompleted}
        />
      </Wrapper>
    </div>
  );
}
