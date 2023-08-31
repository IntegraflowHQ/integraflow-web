import { h } from 'preact';
import {
  AngryEmoji,
  HappyEmoji,
  NeutralEmoji,
  SadEmoji,
  SatisfiedEmoji,
} from '../../assets';
import { Header } from '../../components';
import { Question, RangeSettings, SurveyAnswer, Theme } from '../../types';
import AnswerContainer from './AnswerContainer';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (answers: SurveyAnswer[]) => void;
};

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

export const SmileyResponse = ({ question, theme, onAnswered }: Props) => {
  return (
    <AnswerContainer>
      <Header
        title={question?.label ?? ''}
        description={question?.description}
        color={theme?.question ?? '#050505'}
        centered
      />

      <div>
        <div className={'flex justify-around my-2 mx-auto'}>
          {question.options?.map((option, index) => (
            <button
              key={option.id}
              onClick={() =>
                onAnswered([{ answerId: option.id, answer: option.label }])
              }
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
              color: theme?.answer ?? '#050505',
            }}
          >
            {(question?.settings as RangeSettings).leftText}
          </span>
          <span
            style={{
              color: theme?.answer ?? '#050505',
            }}
          >
            {(question?.settings as RangeSettings).rightText}
          </span>
        </div>
      </div>
    </AnswerContainer>
  );
};
