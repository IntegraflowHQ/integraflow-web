import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Header } from '../../components';
import { ID, Question, RangeSettings, Theme } from '../../types';
import RatingIcon from './RatingIcon';

interface RatingResponseProps {
  question: Question;
  onAnswered: (questionId: ID, value: string) => void;
  theme?: Theme;
}

function RatingResponse({ question, onAnswered, theme }: RatingResponseProps) {
  const [answer, setAnswer] = useState(0);

  useEffect(() => {
    const answerQuestion = () => {
      if (answer === 0) return;
      onAnswered(question.id, answer.toString());
    };

    const timeoutId = setTimeout(answerQuestion, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [answer]);

  return (
    <div className={'px-6 space-y-3'}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
        centered
      />

      <div className='flex justify-center gap-6 px-6'>
        {[1, 2, 3, 4, 5].map((num) => (
          <button onClick={() => setAnswer(num)} key={num.toString()}>
            {
              <RatingIcon
                shape={(question.settings as RangeSettings).shape}
                color={num <= answer ? '#FFCB45' : theme?.answer ?? '#F2F2F2'}
              />
            }
          </button>
        ))}
      </div>

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
