import { ThumbsDown, ThumbsUp } from 'lucide-preact';
import { Fragment, VNode, h } from 'preact';
import { Button, Header } from '../../components';
import { BooleanSettings, Question, SurveyAnswer, Theme } from '../../types';

interface BooleanResponseProps {
  question: Question;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

export default function BooleanResponse({
  question,
  onAnswered,
  theme,
}: BooleanResponseProps): VNode {
  const answerPositive = () => onAnswered([{ answerId: 1 }]);
  const answerNegative = () => onAnswered([{ answerId: 0 }]);

  return (
    <div className={'max-w-[304px] space-y-4'}>
      <Header
        title={question?.label}
        description={question?.description}
        color={theme?.question}
        centered
      />
      <div className='flex justify-between gap-2'>
        {(question?.settings as BooleanSettings).shape === 'button' ? (
          <Fragment>
            <Button
              label={(question.settings as BooleanSettings).positiveText}
              color={theme?.answer}
              onClick={answerPositive}
              variant='surveyInput'
            />
            <Button
              label={(question.settings as BooleanSettings).negativeText}
              color={theme?.answer}
              onClick={answerNegative}
              variant='surveyInput'
            />
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={answerNegative}>
              <ThumbsDown size={32} color={theme?.answer} />
            </button>
            <button onClick={answerPositive}>
              <ThumbsUp size={32} color={theme?.answer} fill={theme?.answer} />
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
}
