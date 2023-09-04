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
import { cn, hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';
import RatingIcon from './RatingIcon';

interface RangeResponseProps {
  question: Question;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
}

function RangeResponse({
  question,
  label,
  description,
  onAnswered,
  theme,
}: RangeResponseProps) {
  const [value, setValue] = useState(0);
  const [answerId, setAnswerId] = useState<ID | null>(null);

  const [hoveredRatingValue, setHoveredRatingValue] = useState(0);

  const answerColor = theme?.answer ?? '#050505';

  useEffect(() => {
    if (value === 0) return;

    onAnswered([
      { answerId: answerId ?? value, answer: String(answerId ?? value) },
    ]);
  }, [value, answerId]);

  const renderOption = (
    index: number,
    option: QuestionOption | null = null
  ) => {
    const isSelected = value === index + 1;

    const handleOptionClick = () => {
      option && setAnswerId(option.id); // When `question.options` is provided
      setValue(index + 1);
    };

    if (question.type === 'nps' || question.type === 'numerical_scale') {
      return (
        <Button
          key={index}
          label={`${index + 1}`}
          onClick={handleOptionClick}
          color={theme?.answer}
          classname='w-[42px] h-[42px] shrink-0'
          variant='surveyInput'
          isActive={isSelected}
        />
      );
    } else if (question.type === 'rating') {
      return (
        <button
          onClick={handleOptionClick}
          key={index}
          onMouseOver={() => setHoveredRatingValue(index + 1)}
        >
          <RatingIcon
            shape={(question.settings as RangeSettings).shape}
            color={
              index + 1 <= hoveredRatingValue
                ? answerColor
                : hexToRgba(answerColor, 0.1)
            }
          />
        </button>
      );
    }

    return null;
  };

  const renderRangeContent = () => {
    if (question.type === 'nps') {
      return Array.from({ length: 10 }, (_, index) => index).map((_, index) =>
        renderOption(index)
      );
    } else if (question.options && question.options.length > 0) {
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
    <AnswerContainer className='space-y-3'>
      <Header title={label} description={description} color={theme?.question} />

      <div
        className={cn(
          'flex gap-1 overflow-y-auto',
          question.type === 'rating' ? 'justify-center' : ''
        )}
        onMouseLeave={() => {
          if (question.type === 'rating') setHoveredRatingValue(0);
        }}
      >
        {renderRangeContent()}
      </div>

      <div className='flex justify-between'>
        <span style={{ color: answerColor }}>
          {(question.settings as RangeSettings).leftText ?? 'Very satisfied'}
        </span>
        <span style={{ color: answerColor }}>
          {(question.settings as RangeSettings).rightText ?? 'Very unsatisfied'}
        </span>
      </div>
    </AnswerContainer>
  );
}

export default RangeResponse;
