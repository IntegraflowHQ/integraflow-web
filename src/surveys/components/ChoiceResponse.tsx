import { VNode, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import {
  AnswerType,
  ID,
  MultipleSettings,
  Question,
  QuestionOption,
  SingleSettings,
  Theme,
} from '../../types';

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
    question.type === AnswerType.MULTIPLE ? [] : ''
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

  const shuffle = (options: QuestionOption[]) => {
    for (let i = 0; i < options.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
  };

  const shuffleArray = (options: QuestionOption[], randomizeAnser: boolean) => {
    const optionsCopy = [...options];
    if (randomizeAnser) {
      shuffle(optionsCopy);
    }
    return optionsCopy;
  };

  const questionOptions = useMemo(
    () =>
      shuffleArray(
        question.options ?? [],
        (question.settings as MultipleSettings | SingleSettings)
          ?.randomizeAnswer ?? false
      ),
    [question.options]
  );

  return (
    <form className={'max-w-sm space-y-4'} onSubmit={handleSubmit}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
      />

      <div className={'space-y-2 min-w-[381px]'}>
        {questionOptions.map((option) => (
          <label
            key={option.id}
            className={'rounded-xl py-3 px-4 flex gap-2 items-center'}
            style={{ backgroundColor: theme?.answer ?? '#F0F0F0' }}
          >
            <input
              type={
                question.type === AnswerType.MULTIPLE ? 'checkbox' : 'radio'
              }
              value={option.id}
              checked={
                question.type === AnswerType.MULTIPLE
                  ? (selectedOption as ID[]).includes(option.id)
                  : selectedOption === option.id
              }
              onChange={() =>
                question.type === AnswerType.MULTIPLE
                  ? handleOptionChange(option.id)
                  : setSelectedOption(option.id)
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <Button
        label={submitText ?? 'Submit'}
        color={theme?.button}
        size="full"
      />
    </form>
  );
}
