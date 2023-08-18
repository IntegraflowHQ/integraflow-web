import { h } from 'preact';
import { Question, Theme } from '../../types';
type Props = {
  question: Question;
  theme: Theme;
};

export const Description = ({ question, theme }: Props) => {
  return (
    <p style={{ color: theme.question ? theme.question : '#000' }}>
      {question.label}
    </p>
  );
};
