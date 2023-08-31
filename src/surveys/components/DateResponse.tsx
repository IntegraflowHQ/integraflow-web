import { h } from 'preact';
import { Button, Header } from '../../components';
import { AnswerType, ID, Question, SurveyAnswer, Theme } from '../../types';

import { useState } from 'preact/hooks';
import { DatePicker } from '../../components';

interface DateResponseProps {
  question: Question;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  submitText?: string;
  theme?: Theme;
}

export default function DateResponse({
  label,
  description,
  onAnswered,
  submitText,
  theme,
}: DateResponseProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedDate) return;
    onAnswered([{ answer: selectedDate.toISOString() }]);
  };

  return (
    <form className='flex flex-col gap-4 w-96' onSubmit={handleSubmit}>
      <div className='mr-6'>
        <Header
          title={label}
          color={theme?.question}
          description={description ?? 'Date'}
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
        onChange={(value) => setSelectedDate(value as Date)}
      />

      <Button
        label={submitText ?? 'Submit'}
        color={theme?.button}
        size='full'
      />
    </form>
  );
}
