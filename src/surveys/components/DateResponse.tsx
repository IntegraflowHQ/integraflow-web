import { h } from 'preact';
import { Button, Header } from '../../components';
import { AnswerType, ID, Question, SurveyAnswer, Theme } from '../../types';

import { useState } from 'preact/hooks';
import { Value } from 'react-date-picker/dist/cjs/shared/types';
import { DatePicker } from '../../components';

interface DateResponseProps {
  question: Question;
  onAnswered: (questionId: ID, answer: SurveyAnswer) => void;
  submitText?: string;
  theme?: Theme;
}

export default function DateResponse({
  question,
  onAnswered,
  submitText,
  theme,
}: DateResponseProps) {
  const [selectedDate, setSelectedDate] = useState<Value>();

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedDate) return;
    onAnswered(question.id, {
      type: AnswerType.DATE,
      value: selectedDate.toLocaleString(),
    });
  };

  return (
    <form className='flex flex-col gap-4 w-96' onSubmit={handleSubmit}>
      <div className='mr-6'>
        <Header
          title={question.label}
          color={theme?.question}
          description={question.description ?? 'Date'}
        />
      </div>

      <DatePicker
        color={theme?.answer}
        clearIcon={null}
        calendarIcon={null}
        dayPlaceholder='DD'
        monthPlaceholder='MM'
        yearPlaceholder='YYYY'
        format='dd/MM/yyyy'
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
      />

      <Button
        label={submitText ?? 'Submit'}
        color={theme?.button}
        size='full'
      />
    </form>
  );
}
