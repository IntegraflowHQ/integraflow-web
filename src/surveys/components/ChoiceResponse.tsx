import { VNode, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import {
  AnswerType,
  MultipleSettings,
  Question,
  QuestionOption,
  SingleSettings,
  SurveyAnswer,
  Theme,
} from '../../types';
import { hexToRgba, shuffleArray } from '../../utils';
import AnswerContainer from './AnswerContainer';

interface SingleResponseProps {
  question: Question;
  onAnswered: (answers: SurveyAnswer[]) => void;
  theme?: Theme;
  submitText?: string;
}

export default function ChoiceResponse({
  question,
  onAnswered,
  submitText,
  theme,
}: SingleResponseProps): VNode {
  const [selectedOption, setSelectedOption] = useState<QuestionOption[]>();

  const handleOptionChange = (option: QuestionOption) => {
    if (question.type === AnswerType.MULTIPLE) {
      setSelectedOption((prevState) =>
        prevState?.includes(option)
          ? prevState.filter((id) => id !== option)
          : [...(prevState ?? []), option]
      );
    } else {
      setSelectedOption([option]);
    }
  };

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedOption) return;
    onAnswered(
      selectedOption.map((option) => ({
        answerId: option.id,
      }))
    );
  };

  const questionOptions = useMemo(() => {
    if ((question.settings as MultipleSettings | SingleSettings).randomize) {
      return shuffleArray(question.options as QuestionOption[], 'all');
    }
    if (
      (question.settings as MultipleSettings | SingleSettings)
        .randomizeExceptLast
    ) {
      return shuffleArray(question.options as QuestionOption[], 'exceptLast');
    }

    return question.options;
  }, [question.options]);

  return (
    <form className={'max-w-sm space-y-4'} onSubmit={handleSubmit}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
      />

      <AnswerContainer className={'space-y-2'}>
        {questionOptions &&
          questionOptions.map((option) => (
            <label
              key={option.id}
              className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
              style={{
                backgroundColor: theme?.answer
                  ? hexToRgba(theme.answer, 0.1)
                  : '#F0F0F0',
                color: theme?.answer ?? '#050505',
              }}
            >
              <input
                style={{
                  padding: '3rem',
                  width: '20px',
                  height: '20px',
                  accentColor: theme?.answer ?? '#050505',
                }}
                type={
                  question.type === AnswerType.MULTIPLE ? 'checkbox' : 'radio'
                }
                value={option.id}
                checked={selectedOption?.includes(option)}
                onChange={() => {
                  handleOptionChange(option);
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
      </AnswerContainer>

      <Button
        label={submitText ?? 'Submit'}
        color={theme?.button}
        size='full'
      />
    </form>
  );
}
