import { h } from 'preact';
import { Label } from './Label';
import { CTASettings, FormField, Question, Theme } from '../../types';
import { Button } from '../../components';

type Props = {
  question: Question;
  formData: FormField[];
  theme: Theme;
  onAnswer: () => void;
};

export const ContactFormResponse = ({
  question,
  theme,
  onAnswer,
  formData,
}: Props) => {
  const onSubmitHandler = (e: Event) => {
    if (onAnswer) {
      e.preventDefault();
      onAnswer();
    }
  };

  return (
    <div>
      <p>
        <Label question={question} theme={theme} />
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data = Object.fromEntries(formData.entries());
          console.log(data);
          onSubmitHandler(e);
        }}
      >
        {formData.map((field) => {
          return (
            <div>
              <label htmlFor={field.label}>{field.label}</label>
              <input type={field.type} name={field.label} id={field.label} />
            </div>
          );
        })}
        <Button
          label={(question.settings as CTASettings).text}
          theme={theme}
          type={'submit'}
        />
      </form>
    </div>
  );
};
