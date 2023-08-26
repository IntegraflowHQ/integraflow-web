import { h } from 'preact';
import { useContext } from 'preact/hooks';

import { CTASettings, CTAType, ID, Question, SurveyAnswer, Theme } from '../../types';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components';
import { SurveyContext } from '../context';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: (answer: SurveyAnswer[], nextQuestionId: ID | null) => void;
};

export const CTAResponse = ({ question, theme, onAnswered }: Props) => {
  const surveyContext = useContext(SurveyContext);

  const onClickHandler = () => {
    onAnswered([{ ctaSuccess: true }], question.id);
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
