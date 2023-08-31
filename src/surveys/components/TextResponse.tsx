import { h } from 'preact';
import { Question, SurveyAnswer, TextSettings, Theme } from '../../types';
import { useMemo, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
type Props = {
  question: Question;
  label: string;
  description?: string;
  theme?: Theme;
  submitText?: string;
  onAnswered: (answer: SurveyAnswer[]) => void;
};

const TextResponse = ({ theme, question, label, description, submitText, onAnswered }: Props) => {
  const [answer, setAnswer] = useState('');

  const onSubmitHandler = (
    event: h.JSX.TargetedEvent<HTMLFormElement, Event>
  ) => {
    event.preventDefault();

    onAnswered([{ answer }]);
  };

  return (
    <div className={'max-w-[440px]'}>
      <Header
        title={label}
        description={description}
        color={theme?.question}
      />
      <div>
        <form onSubmit={onSubmitHandler}>
          {(question.settings as TextSettings).singleLine === true ? (
            <input
              type="text"
              className={
                'w-full mt-3 border border-gray-300 rounded-xl p-3 bg-formily-grey focus:outline-none focus:ring-1 focus:border-transparent'
              }
              style={{
                color: theme?.answer,
                backgroundColor: `${theme?.answer}1A`,
                // 1A is 10% opacity of the color hex code
              }}
              name={question.id.toString()}
              id={question.id.toString()}
              placeholder={'Type your answer here...'}
              value={answer}
              onChange={(e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
                setAnswer(e.currentTarget.value);
              }}
            />
          ) : (
            <div>
              <textarea
                name={question.id.toString()}
                id={question.id.toString()}
                cols={20}
                rows={5}
                placeholder={'Type your answer here...'}
                value={answer}
                onChange={(
                  e: h.JSX.TargetedEvent<HTMLTextAreaElement, Event>
                ) => {
                  setAnswer(e.currentTarget.value);
                }}
                className={
                  'w-full mt-3 resize-none border border-gray-300 rounded-xl p-4 bg-formily-grey focus:outline-none focus:ring-1 focus:border-transparent'
                }
                style={{
                  color: theme?.answer,
                  backgroundColor: `${theme?.answer}1A`,
                }}
              ></textarea>
            </div>
          )}
          <Button
            color={theme?.button}
            label={submitText ?? 'Submit'}
            type="submit"
            size="full"
            classname="mt-3"
          />
        </form>
      </div>
    </div>
  );
};

export default TextResponse;
