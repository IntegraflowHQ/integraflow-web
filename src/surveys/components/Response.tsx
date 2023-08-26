import { h } from 'preact';

import { AnswerType, ID, Question, SurveyAnswer, Theme } from '../../types';
import TextResponse from './TextResponse';
import { SmileyResponse } from './SmileyResponse';
import DateResponse from './DateResponse';
import { CTAResponse } from './CTAResponse';

interface ResponseProps {
  question: Question;
  onAnswered: (answers: SurveyAnswer[], nextQuestionId?: ID | null) => void;
  theme?: Theme;
  submitText?: string;
}

export default function Response({
  question,
  onAnswered,
  theme,
  submitText
}: ResponseProps) {
  let element: h.JSX.Element;

  switch (question.type) {
    case AnswerType.TEXT:
      element = <TextResponse
        question={question}
        onAnswered={onAnswered}
        theme={theme}
      />;
      break;
    case AnswerType.SMILEY_SCALE:
      element = <SmileyResponse
        question={question}
        onAnswered={onAnswered}
        theme={theme}
      />;
      break;
    case AnswerType.DATE:
      element = <DateResponse
        question={question}
        onAnswered={onAnswered}
        theme={theme}
        submitText={submitText}
      />;
      break;
    case AnswerType.CTA:
      element = <CTAResponse
        question={question}
        onAnswered={onAnswered}
        theme={theme}
      />;
      break;
    case AnswerType.NPS:
      element = <div>NPS</div>;
      break;
    case AnswerType.RATING:
      element = <div>Rating</div>;
      break;
    case AnswerType.CSAT:
      element = <div>CSAT</div>;
      break;
    case AnswerType.MULTIPLE:
      element = <div>Multiple</div>;
      break;
    case AnswerType.SINGLE:
      element = <div>Single</div>;
      break;
    case AnswerType.FORM:
      element = <div>Form</div>
      break;
    case AnswerType.NUMERICAL_SCALE:
      element = <div>Numerical</div>
      break;
  }

  return element;
}
