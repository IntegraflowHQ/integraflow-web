import { h } from 'preact';

import { Header } from '../../components';
import { Button } from '../../components/Button/Button';
import {
  CTASettings,
  CTAType,
  Question,
  SurveyAnswer,
  Theme,
} from '../../types';

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
    <div>
      <Header
        title={question?.label}
        description={question?.description}
        color={theme?.question}
      />

      {(question?.settings as CTASettings).type === CTAType.HIDDEN ? null : (
        <Button
          label={(question?.settings as CTASettings).text}
          onClick={onClickHandler}
          classname='mt-3'
          position='right'
          color={theme?.button}
        />
      )}
    </div>
  );
};
