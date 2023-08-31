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
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
};

export const CTAResponse = ({
  question,
  theme,
  label,
  description,
  onAnswered,
}: Props) => {
  const onClickHandler = () => {
    onAnswered([{ ctaSuccess: true, answer: '' }]);
  };

  return (
    <div className={'w-screen max-w-full space-y-3'}>
      <Header title={label} description={description} color={theme?.question} />

      {(question?.settings as CTASettings).type === CTAType.HIDDEN ? null : (
        <Button
          label={(question?.settings as CTASettings).text}
          onClick={onClickHandler}
          size='full'
          color={theme?.button}
        />
      )}
    </div>
  );
};
