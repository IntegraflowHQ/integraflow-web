import { h } from 'preact';
import { CTASettings, Question, Theme } from '../../types';
import { useState } from 'preact/hooks';
import { Button, Header } from '../../components';
type Props = {
  question: Question;
  theme?: Theme;
  onAnswered?: () => void;
};

const TextResponse = ({ theme, question, onAnswered }: Props) => {
  const [answer, setAnswer] = useState('');

  const onSubmitHandler = (
    event: h.JSX.TargetedEvent<HTMLFormElement, Event>
  ) => {
    event.preventDefault();
    if (onAnswered) {
      onAnswered();
    }
  };

  return (
    <div className={'max-w-[440px]'}>
      <Header
        title={question.label}
        description={question.description}
        color={theme?.question}
      />
      <div>
        <form onSubmit={onSubmitHandler}>
          <textarea
            name=""
            id=""
            cols={20}
            rows={5}
            placeholder={'Type your answer here...'}
            onChange={(e) => {
              console.log(e.target);
            }}
            className={
              'w-full mt-3 resize-none border border-gray-300 rounded-xl p-4 bg-formily-grey focus:outline-none focus:ring-2 focus:ring-formily-blue focus:border-transparent'
            }
          ></textarea>
          <div className={'mt-3'}>
            <Button
              label={(question?.settings as CTASettings).text}
              type="submit"
              size="full"
              classname="mt-3"
            />
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default TextResponse;
