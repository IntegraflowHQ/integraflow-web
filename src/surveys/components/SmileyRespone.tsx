import { h } from 'preact';
import { Label } from './Label';
import { Question, QuestionAnswer, Theme } from '../../types';

type Props = {
  question: Question;
  theme: Theme;
  onAnswer: (answer:QuestionAnswer) => void;
};

export const SmileyRespone = ({ question, theme }: Props) => {
  return (
    <div>
      <p>
        <Label question={question} theme={theme} />
          </p>
          
    </div>
  );
};
