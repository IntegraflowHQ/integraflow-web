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
    <div>
      <Header
        title={question?.label ? question.label : ''}
        description={question?.description}
        color={theme?.question ? theme?.question : '#050505'}
        centered
      />
      <div>
        <div className={'flex justify-around max-w-[317px] my-2 mx-auto'}>
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
        <div className={'flex gap-12 justify-between w-full '}>
          <span
            style={{
              color: theme?.question ? theme?.question : '#050505',
            }}
          >
            {(question?.settings as RangeSettings).leftText}
          </span>
          <span
            style={{
              color: theme?.question ? theme?.question : '#050505',
            }}
          >
            {(question?.settings as RangeSettings).rightText}
          </span>
        </div>
      </div>
    </div>
  );
};
