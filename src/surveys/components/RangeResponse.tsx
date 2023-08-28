import classnames from 'classnames';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import {
  ID,
  Question,
  QuestionOption,
  RangeSettings,
  SurveyAnswer,
  Theme,
} from '../../types';
import { hexToRgba } from '../../utils';
import RatingIcon from './RatingIcon';

interface RangeResponseProps {
  question: Question;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

function RangeResponse({ question, onAnswered, theme }: RangeResponseProps) {
  const [value, setValue] = useState(0);
  const [answerId, setAnswerId] = useState<ID | null>(null);

  const lightAnswerColor = theme?.answer && hexToRgba(theme.answer, 0.1);

  useEffect(() => {
    const answerQuestion = () => {
      if (value === 0) return;

      const answer = answerId
        ? { type: question.type, answerId: answerId }
        : { type: question.type, answer: value.toString() };

      onAnswered([answer]);
    };

    const timeoutId = setTimeout(answerQuestion, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, answerId]);

  const renderOption = (
    index: number,
    option: QuestionOption | null = null
  ) => {
    const isSelected = value === index + 1;

    const handleOptionClick = () => {
      option && setAnswerId(option.id);
      setValue(index + 1);
    };

    if (question.type === 'nps') {
      return (
        <Button
          key={index}
          label={`${index + 1}`}
          size='sm'
          onClick={handleOptionClick}
          color={theme?.answer}
          classname='border w-[56px] h-[52px]'
          variant='surveyInput'
          isActive={isSelected}
        />
      );
    } else if (question.type === 'rating') {
      return (
        <button onClick={handleOptionClick} key={index}>
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={index + 1 <= value ? theme?.answer : lightAnswerColor}
          />
        </button>
      );
    }

    return null;
  };

  const renderRangeContent = () => {
    if (question.options && question.options.length > 0) {
      return question.options
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((option, index) => renderOption(index, option));
    } else if ((question.settings as RangeSettings).count) {
      return Array.from(
        { length: (question.settings as RangeSettings).count! },
        (_, index) => index + 1
      ).map((_, index) => renderOption(index));
    }

    return null;
  };

  return (
    <div className='px-6 space-y-3'>
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
        {renderRangeContent()}
      </div>

      <div className='flex justify-between'>
        <span style={{ color: theme?.answer ?? '#050505' }}>
          {(question.settings as RangeSettings).leftText ?? 'Very satisfied'}
        </span>
        <span style={{ color: theme?.answer ?? '#050505' }}>
          {(question.settings as RangeSettings).rightText ?? 'Very unsatisfied'}
        </span>
      </div>
    </div>
  );
}

export default RangeResponse;
