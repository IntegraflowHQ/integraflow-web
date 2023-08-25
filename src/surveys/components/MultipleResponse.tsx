import { h } from 'preact';
import { Button, Header } from '../../components';
import { useState } from 'preact/hooks';
import { Question, ID, Theme } from '../../types';

interface Props {
  question: Question;
  onAnswered: (questionId: ID, answerId: ID[]) => void;
  theme?: Theme;
}

export const MultipleResponse = ({ question, onAnswered, theme }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<ID[]>([]);

  const handleOptionChange = (optionId: ID) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };
  console.log(selectedOptions);

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (selectedOptions.length === 0) return;

    onAnswered(question.id, selectedOptions);
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
            className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
            style={{ backgroundColor: theme?.answer ?? '#F0F0F0' }}
          >
            <input
              type="checkbox"
              value={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <Button label={'Submit'} color={theme?.button} size="full" />
    </form>
  );
};
