import { JSX, h } from 'preact';
import { Header } from '../../components';
import { Question, RangeSettings, Theme } from '../../types';

import {
  AngryEmoji,
  HappyEmoji,
  NeutralEmoji,
  SadEmoji,
  SatisfiedEmoji,
} from '../../assets';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (questionId: string | number, answer: string) => void;
};

type SmileyOption = {
  id: string | number;
  emoji: JSX.Element;
  label: string;
}[];

export const SmileyResponse = ({ question, theme, onAnswered }: Props) => {
  const smileyOptions = [
    {
      id: 1,
      emoji: <AngryEmoji />,
      label: 'Angry',
    },
    {
      id: 2,
      emoji: <SadEmoji />,
      label: 'Sad',
    },
    {
      id: 3,
      emoji: <NeutralEmoji />,
      label: 'Neutral',
    },
    {
      id: 4,
      emoji: <SatisfiedEmoji />,
      label: 'Satisfied',
    },
    {
      id: 5,
      emoji: <HappyEmoji />,
      label: 'Happy',
    },
  ];

  return (
    <div className={'max-w-[389px]'}>
      <Header
        title={question?.label ? question.label : ''}
        description={question?.description}
        color={theme?.question ? theme?.question : '#050505'}
        centered
      />
      <div>
        <div className={'flex space-x-8 my-2'}>
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswered(question.id, option.label)}
              className={'cursor-pointer block p-2 rounded-full bg-[#EFF0F6]'}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={'flex justify-between'}>
          <span>{(question?.settings as RangeSettings).leftText}</span>
          <span>{(question?.settings as RangeSettings).rightText}</span>
        </div>
      </div>
    </div>
  );
};
