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
                value === option.orderNumber ? theme?.button : theme?.background
              }
              textColor={
                value === option.orderNumber ? theme?.background : theme?.button
              }
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
                option.orderNumber <= value
                  ? '#FFCB45'
                  : theme?.answer ?? '#F2F2F2'
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
            color={value === num ? theme?.button : theme?.background}
            textColor={value === num ? theme?.background : theme?.button}
            classname='border'
          />
        );

      return (
        <button onClick={() => setValue(num)} key={num.toString()}>
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={num <= value ? '#FFCB45' : theme?.answer ?? '#F2F2F2'}
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

export default RangeResponse;
