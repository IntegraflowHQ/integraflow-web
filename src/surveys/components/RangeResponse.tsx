import classnames from 'classnames';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { ID, Question, RangeSettings, SurveyAnswer, Theme } from '../../types';
import RatingIcon from './RatingIcon';

interface RangeResponseProps {
  question: Question;
  onAnswered: (questionId: ID, answer: SurveyAnswer) => void;
  theme?: Theme;
}

function RangeResponse({ question, onAnswered, theme }: RangeResponseProps) {
  const [value, setValue] = useState(0);
  const [answerId, setAnswerId] = useState<ID | null>(null);

  const lightAnswerColor = theme?.answer && `${theme?.answer}1A`;
  const mediumAnswerColor = theme?.answer && `${theme?.answer}9A`;

  useEffect(() => {
    const answerQuestion = () => {
      if (value === 0) return;

      if (answerId)
        return onAnswered(question.id, {
          type: question.type,
          id: answerId,
        });

      onAnswered(question.id, {
        type: question.type,
        value: value.toString(),
      });
    };

    const timeoutId = setTimeout(answerQuestion, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, answerId]);

  let rangeContent = null;

  if (question.options && question.options.length > 0) {
    rangeContent = question.options
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((option, index) => {
        if (question.type === 'nps')
          return (
            <Button
              label={`${index + 1}`}
              size='sm'
              onClick={() => {
                setAnswerId(option.id);
                setValue(option.orderNumber);
              }}
              color={
                value === option.orderNumber
                  ? mediumAnswerColor
                  : lightAnswerColor
              }
              textColor={theme?.answer}
              classname='border'
            />
          );

        return (
          <button
            onClick={() => {
              setAnswerId(option.id);
              setValue(option.orderNumber);
            }}
            key={option.id}
          >
            <RatingIcon
              shape={(question.settings as RangeSettings).shape}
              color={
                option.orderNumber <= value ? theme?.answer : lightAnswerColor
              }
            />
          </button>
        );
      });
  } else if ((question.settings as RangeSettings).count) {
    rangeContent = Array.from(
      { length: (question.settings as RangeSettings).count! },
      (_, index) => index + 1
    ).map((num) => {
      if (question.type === 'nps')
        return (
          <Button
            label={num.toString()}
            size='sm'
            onClick={() => setValue(num)}
            color={value === num ? mediumAnswerColor : lightAnswerColor}
            textColor={theme?.answer}
            classname='border'
          />
        );

      return (
        <button onClick={() => setValue(num)} key={num.toString()}>
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={num <= value ? theme?.answer : lightAnswerColor}
          />
        </button>
      );
    });
  }

  return (
    <div className={'px-6 space-y-3'}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
        centered={question.type === 'rating'}
      />

      <div
        className={classnames(
          'flex',
          question.type === 'nps' ? 'gap-4' : 'gap-6',
          question.type === 'rating' && 'px-6 justify-center'
        )}
      >
        {rangeContent}
      </div>

      <div className='flex justify-between'>
        <span style={{ color: theme?.answer ?? '#050505' }}>
          {(question.settings as RangeSettings).leftText ?? 'Very unsatisfied'}
        </span>
        <span style={{ color: theme?.answer ?? '#050505' }}>
          {(question.settings as RangeSettings).rightText ?? 'Very satisfied'}
        </span>
      </div>
    </div>
  );
}

export default RangeResponse;
