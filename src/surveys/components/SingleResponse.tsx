import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { ID, Question, Theme } from '../../types';

interface SingleResponseProps {
  question: Question;
  onAnswered: (questionId: ID, answerId: ID) => void;
  submitText?: string;
  theme?: Theme;
}

export default function SingleResponse({
  question,
  onAnswered,
  submitText,
  theme,
}: SingleResponseProps): VNode {
  const [selectedOption, setSelectedOption] = useState<ID>('');

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedOption) return;

    onAnswered(question.id, selectedOption);
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
            onClick={() => setSelectedOption(option.id)}
            className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
            style={{ backgroundColor: theme?.answer ?? '#F0F0F0' }}
          >
            <input
              type='radio'
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
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
