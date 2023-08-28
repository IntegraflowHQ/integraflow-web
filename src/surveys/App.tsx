import { VNode, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Wrapper } from '../components';
import { ID, Question, Survey, SurveyAnswer } from '../types';
import SurveyView from './components/Survey';

interface AppProps {
  survey: Survey;
  getNextQuestionId: (question: Question, answers: SurveyAnswer[]) => ID | null;
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
  getNextQuestionId,
  onSurveyDisplayed,
  onSurveyClosed,
  onQuestionAnswered,
  onSurveyCompleted,
}: AppProps): VNode {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    onSurveyDisplayed?.(survey.id);
  });

  const close = (force: boolean = false) => {
    setIsOpen(false);
    setTimeout(() => {
      onSurveyClosed?.(survey.id);
    }, force ? 0 : 500); // wait for animation to finish
  };

  return (
    <Wrapper
      // isOpen={isOpen}
      close={() => close(true)}
      placement={survey.settings.placement}
      background={survey.theme?.background}
    >
      <SurveyView
        survey={survey}
        close={close}
        getNextQuestionId={getNextQuestionId}
        onQuestionAnswered={onQuestionAnswered}
        onSurveyCompleted={onSurveyCompleted}
      />
    </Wrapper>
  );
}
