import { h } from 'preact';
import { Input } from '../../components/Input';
import {
  FormField,
  FormFieldType,
  FormSettings,
  Question,
  Theme,
} from '../../types';
import { Button } from '../../components';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (questionId: string | number, answer: string) => void;
};

export const ContactFormResponse = ({ question, theme, onAnswered }: Props) => {
  return (
    <div className={'space-y-6'}>
      <div>
        {(question.options as FormField[]).map((option) => {
          return (
            <div className={'mb-3'}>
              <Input
                name={option.id + ''}
                id={option.id}
                label={option.label}
                type={option.type}
                onChange={() => {}}
              />
            </div>
          );
        })}
      </div>
      <Button
        label={(question.settings as FormSettings).consentText}
        size="full"
      />
    </div>
  );
};
