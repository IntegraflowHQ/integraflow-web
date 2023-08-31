import { h } from 'preact';
import {
  FormField,
  FormSettings,
  Question,
  SurveyAnswer,
  Theme,
} from '../../types';
import { Button, Header, Input } from '../../components';
import { useState } from 'preact/hooks';
import { LockIcon } from 'lucide-preact';
import { hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (answers: SurveyAnswer[]) => void;
  submitText?: string;
  label: string;
  description: string;
};

export const ContactFormResponse = ({
  label,
  description,
  question,
  theme,
  onAnswered,
  submitText,
}: Props) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const handleInputChange = (fieldId: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  const onSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    const answers: SurveyAnswer[] = [];
    (question.options as FormField[]).forEach((option) => {
      const answer = inputValues[option.id];
      answers.push({
        fieldType: option.type,
        answer,
      });
    });

    onAnswered(answers);
  };

  return (
    <AnswerContainer>
      <Header title={label} description={description} color={theme?.question} />
      <form onSubmit={onSubmit}>
        {(question.options as FormField[]).map((option) => {
          return (
            <div className={'mb-2'}>
              <Input
                option={option}
                required={option.required}
                value={inputValues[option.id] || ''}
                name={option.id + ''}
                id={option.id}
                label={option.label}
                type={option.type}
                onChange={(value) => handleInputChange(option.id + '', value)}
              />
            </div>
          );
        })}
        <Button
          label={submitText ?? 'Submit'}
          size="full"
          type="submit"
          disabled={!checked}
        />
        {(question.settings as FormSettings).consent && (
          <label
            className={
              'rounded-md mt-3 flex p-2 px-4 gap-2 items-center text-sm'
            }
            style={{
              color: theme?.answer ?? '#050505',
              backgroundColor: theme?.answer
                ? hexToRgba(theme?.answer, 0.1)
                : '#F0F0F0',
            }}
          >
            <input
              style={{
                width: '15px',
                height: '15px',
                accentColor: theme?.answer ?? '#050505',
              }}
              type="checkbox"
              value=""
              checked={checked}
              onChange={handleChange}
            />
            <span>{(question.settings as FormSettings).consentText}</span>
          </label>
        )}
        {(question.settings as FormSettings).disclaimer && (
          <p
            className={'flex items-center rounded-sm p-2 px-4 gap-2 mt-3'}
            style={{
              color: theme?.answer ?? '#050505',
              fontSize: '14px',
              backgroundColor: theme?.answer
                ? hexToRgba(theme?.answer, 0.1)
                : '#F0F0F0',
            }}
          >
            <span>
              <LockIcon size={13} />
            </span>
            <span>{(question.settings as FormSettings).disclaimerText}</span>
          </p>
        )}
      </form>
    </AnswerContainer>
  );
};
