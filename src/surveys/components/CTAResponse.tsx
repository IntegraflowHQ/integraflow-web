import { h } from 'preact';
import { useContext } from 'preact/hooks';

import { CTASettings, CTAType, ID, Question, SurveyAnswer, Theme } from '../../types';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (answers: SurveyAnswer[]) => void;
};

export const CTAResponse = ({ question, theme, onAnswered }: Props) => {
  const onClickHandler = () => {
    onAnswered([{ ctaSuccess: true }]);
  };

  return (
    <div className={'max-w-[489px]'}>
      <Header
        title={question?.label}
        description={question?.description}
        color={theme?.question ? theme?.question : '#050505'}
      />

      {(question?.settings as CTASettings).type === CTAType.HIDDEN ? null : (
        <Button
          label={(question?.settings as CTASettings).text}
          onClick={onClickHandler}
          classname="mt-3"
          position="right"
          type={'submit'}
        />
      )}
    </div>
  );
};
