import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';

import { ID, Survey, SurveyAnswer } from '../../types';
import { SmileyResponse } from './SmileyResponse';
import { AngryEmoji } from '../../assets';

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
      <SmileyResponse
        onAnswered={(questionId, answer) => {
          console.log(questionId, answer);
        }}
        question={{
          id: 1,
          label: 'How was your experience?',
          type: 'basic',
          maxPath: 4,
          settings: {
            text: 'Submit',
            leftText: 'Bad',
            rightText: 'Good',
          },
          description: 'It will only take a few minutes',
        }}
      />
    </div>
  );
}
