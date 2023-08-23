import { h } from 'preact';
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
  onAnswered: (questionId: string | number, answer: number) => void;
};

export const SmileyResponse = ({ question, theme, onAnswered }: Props) => {
  const smileyOptions = [
    <AngryEmoji />,
    <SadEmoji />,
    <NeutralEmoji />,
    <SatisfiedEmoji />,
    <HappyEmoji />,
  ];

  const getCountBasedIndex = (count: number, optionIndex: number): number => {
    if (count === 3) {
      return optionIndex * 2;
    } else if (count === 5) {
      return optionIndex;
    }
    return 0;
  };

  const renderSmiley = (count: number, optionIndex: number) => {
    const smileyIndex = getCountBasedIndex(count, optionIndex);
    return smileyOptions[smileyIndex];
  };

  return (
    <div className={'max-w-[389px]'}>
      <Header
        title={question?.label ? question.label : ''}
        description={question?.description}
        color={theme?.question ? theme?.question : '#050505'}
        centered
      />
      <div>
        <div className={'flex justify-between space-x-8 my-2'}>
          {question.options?.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onAnswered(question.id, option.orderNumber)}
              className={'cursor-pointer block p-2 rounded-full bg-[#EFF0F6]'}
            >
              {renderSmiley(
                (question.settings as RangeSettings).count as number,
                index
              )}
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
