import { h } from 'preact';
import { Question, Theme } from '../../types';
import { Label } from './Label';
import { useState } from 'preact/hooks';
type Props = {
  question: Question;
  theme: Theme;
  onAnswer: (answer: string) => void;
};

const TextResponse = ({ theme, question, onAnswer }: Props) => {
  const [answer, setAnswer] = useState('');

    const onSubmitHandler = (event: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
      event.preventDefault()
    if (onAnswer) {
      onAnswer(answer);
    }
  };

  return (
    <div>
      <Label question={question} theme={theme} />
      <div>
        {/* <form
          onSubmit={(e) => {
            onSubmitHandler(e, answer);
          }}
        > */}
                  {/* <textarea name="" id="" cols={30} rows={10}
                   onChange={(e) => {
                        setAnswer(e.target?.value);
                       }
                  >
                  </textarea> */}
        {/* </form> */}
      </div>
      <div></div>
    </div>
  );
};

export default TextResponse;
