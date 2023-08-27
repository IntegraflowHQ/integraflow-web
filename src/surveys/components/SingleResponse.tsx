import { VNode, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { ID, Question, QuestionOption, SurveyAnswer, Theme } from '../../types';

interface SingleResponseProps {
  question: Question;
  onAnswered: (answer: SurveyAnswer[]) => void;
  submitText?: string;
  theme?: Theme;
}

export default function SingleResponse({
  question,
  onAnswered,
  submitText,
  theme,
}: SingleResponseProps): VNode {
  const [selectedOption, setSelectedOption] = useState<QuestionOption>();

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedOption) {
      return;
    }

    onAnswered([{ answerId: selectedOption.id, answer: selectedOption.label }]);
  };

  return (
    <form className={'max-w-sm space-y-4'} onSubmit={handleSubmit}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
      />
      <div className={'space-y-2'}>
        {(question.options ?? []).map((option) => (
          <label
            onClick={() => setSelectedOption(option)}
            className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
            style={{ backgroundColor: theme?.answer ?? '#F0F0F0' }}
          >
            <input
              type='radio'
              value={option.id}
              checked={selectedOption?.id === option.id}
              onChange={() => setSelectedOption(option)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <Button
        label={submitText ?? 'Submit'}
        color={theme?.button}
        size='full'
      />
    </form>
  );
}
