import { VNode, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Wrapper } from '../components';
import { ID, Survey, SurveyAnswer } from '../types';
import SurveyView from './components/Survey';
import { SurveyLogic } from './logic';
import { SurveyContext } from './context';

interface AppProps {
  survey: Survey;
  surveyLogic: SurveyLogic;
  onSurveyDisplayed?: (surveyId: ID) => void;
  onSurveyClosed?: (surveyId: ID) => Promise<void>;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answers: SurveyAnswer[]
  ) => void;
  onSurveyCompleted?: (surveyId: ID) => void;
}

export default function App({
  survey,
  surveyLogic,
  onSurveyDisplayed,
  onSurveyClosed,
  onQuestionAnswered,
  onSurveyCompleted,
}: AppProps): VNode {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    onSurveyDisplayed?.(survey.id);
  });

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      onSurveyClosed?.(survey.id);
    }, 1000); // wait for animation to finish
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyLogic,
        theme: survey.theme
      }}
    >
      <Wrapper
        // isOpen={isOpen}
        close={close}
        placement={survey.settings.placement}
        background={survey.theme?.background}
      >
        <SurveyView
          survey={survey}
          close={close}
          onQuestionAnswered={onQuestionAnswered}
          onSurveyCompleted={onSurveyCompleted}
        />
      </Wrapper>
    </SurveyContext.Provider>
  );
}
