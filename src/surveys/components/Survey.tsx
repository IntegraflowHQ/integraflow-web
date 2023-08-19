import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';

import { ID, Survey, SurveyAnswer } from '../../types';

interface SurveyProps {
  survey: Survey;
  close: (surveyId: string) => void;
  onSurveyDisplayed?: (surveyId: ID) => void;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answer: SurveyAnswer
  ) => void;
  onSurveyCompleted?: (surveyId: ID) => void;
}

export default function Survey({
  survey,
  close,
  onSurveyDisplayed,
  onQuestionAnswered,
  onSurveyCompleted,
}: SurveyProps): VNode {
  // TODO: Navigate through all the questions one after the other based on the logic settings
  return <div></div>;
}
