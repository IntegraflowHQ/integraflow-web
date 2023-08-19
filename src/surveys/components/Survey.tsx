import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';

import { CTAType, ID, Survey, SurveyAnswer } from '../../types';
import { CTAResponse } from './CTAResponse';

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
  return (
    <div>
      <CTAResponse
        onAnswer={() => {}}
        theme={{
          background: '#000',
          question: '#000',
        }}
        question={{
          id: '1',
          label: 'Could you please fill out our quick survey',
          type: 'basic',
          maxPath: 4,
          settings: {
            type: CTAType.CLOSE,
            text: 'Close',
          },
          description: 'It will only take a few minutes',
        }}
      />
    </div>
  );
}
