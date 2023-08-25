import { VNode, h } from 'preact';
import { useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { FormSettings, ID, Question, Theme } from '../../types';

interface SingleResponseProps {
  question: Question;
  onAnswered: (questionId: ID, answerId: ID | ID[]) => void;
  submitText?: string;
  theme?: Theme;
}

export default function SelectResponse({
  question,
  onAnswered,
  submitText,
  theme,
}: SingleResponseProps): VNode {
  const [selectedOption, setSelectedOption] = useState<ID | ID[]>(
    (question.settings as FormSettings).multiselect ? [] : ''
  );

  const handleOptionChange = (optionId: ID) => {
    if ((selectedOption as ID[]).includes(optionId)) {
      setSelectedOption((prevState) =>
        (prevState as ID[]).filter((id) => id !== optionId)
      );
    } else {
      setSelectedOption((prevState) => [...(prevState as ID[]), optionId]);
    }
  };

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
            key={option.id}
            onClick={() =>
              (question.settings as FormSettings).multiselect
                ? handleOptionChange(option.id)
                : setSelectedOption(option.id)
            }
            className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
            style={{ backgroundColor: theme?.answer ?? '#F0F0F0' }}
          >
            <input
              type={
                (question.settings as FormSettings).multiselect
                  ? 'checkbox'
                  : 'radio'
              }
              value={option.id}
              checked={
                (question.settings as FormSettings).multiselect
                  ? (selectedOption as ID[]).includes(option.id)
                  : selectedOption === option.id
              }
              onChange={() => null} // To avoid React warning
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <Button
        label={submitText ?? 'Submit'}
        color={submitText ? submitText : 'Submit'}
        size="full"
      />
    </form>
  );
}
