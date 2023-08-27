import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Header } from '../../components';
import {
  AnswerType,
  ID,
  Question,
  RangeSettings,
  SurveyAnswer,
  Theme,
} from '../../types';
import RatingIcon from './RatingIcon';

interface RatingResponseProps {
  question: Question;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

function RatingResponse({ question, onAnswered, theme }: RatingResponseProps) {
  const [rating, setRating] = useState(0);
  const [answerId, setAnswerId] = useState<ID | null>(null);

  useEffect(() => {
    const answerQuestion = () => {
      if (rating === 0) return;

      if (answerId)
        return onAnswered(question.id, {
          type: AnswerType.RATING,
          id: answerId,
        });

      onAnswered(question.id, {
        type: AnswerType.RATING,
        value: rating.toString(),
      });
    };

    const timeoutId = setTimeout(answerQuestion, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [rating, answerId]);

  let rangeContent = null;

  if (question.options && question.options.length > 0) {
    rangeContent = question.options
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((option) => (
        <button
          onClick={() => {
            setAnswerId(option.id);
            setRating(option.orderNumber);
          }}
          key={option.label}
        >
          {
            <RatingIcon
              shape={(question.settings as RangeSettings).shape}
              color={
                option.orderNumber <= rating
                  ? '#FFCB45'
                  : theme?.answer ?? '#F2F2F2'
              }
            />
          }
        </button>
      ));
  } else if ((question.settings as RangeSettings).count) {
    rangeContent = Array.from(
      { length: (question.settings as RangeSettings).count! },
      (_, index) => index + 1
    ).map((num) => (
      <button onClick={() => setRating(num)} key={num.toString()}>
        {
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={num <= rating ? '#FFCB45' : theme?.answer ?? '#F2F2F2'}
          />
        }
      </button>
    ));
  }

  return (
    <div className={'px-6 space-y-3'}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
        centered
      />

      <div className='flex justify-center gap-6 px-6'>{rangeContent}</div>

      <div className='flex justify-between'>
        <span style={{ color: theme?.question ?? '#050505' }}>
          {(question.settings as RangeSettings).leftText ?? 'Very unsatisfied'}
        </span>
        <span style={{ color: theme?.question ?? '#050505' }}>
          {(question.settings as RangeSettings).rightText ?? 'Very satisfied'}
        </span>
      </div>
    </div>
  );
}

export default RatingResponse;
