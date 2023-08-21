import { h } from 'preact';
import { CTASettings, CTAType, Question, Theme } from '../../types';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components';

type Props = {
  question: Question;
  theme?: Theme;
  onAnswered: () => void;
};

export const CTAResponse = ({ question, theme, onAnswered }: Props) => {
  const onClickHandler = () => {
    if (onAnswered) {
      onAnswered();
    }
  };

  return (
    <div className={'border'}>
      <Header
        title={question?.label}
        description={question?.description}
        color={theme?.question ? theme?.question : '#050505'}
      />

      {(question?.settings as CTASettings).type === CTAType.CLOSE && (
        <div>
          <Button
            label={(question?.settings as CTASettings).text}
            onClick={onClickHandler}
            classname="mt-3"
            position="right"
            type={'submit'}
          />
        </div>
      )}
      {(question?.settings as CTASettings).type === CTAType.LINK && (
        <div className={'mt-3'}>
          <Button
            label={(question?.settings as CTASettings).text}
            onClick={onClickHandler}
            classname="mt-3"
            position="right"
            type={'submit'}
          />
        </div>
      )}
      {(question?.settings as CTASettings).type === CTAType.NEXT && (
        <div className={'mt-3'}>
          <Button
            label={(question?.settings as CTASettings).text}
            onClick={onClickHandler}
            classname="mt-3"
            position="right"
            type={'submit'}
          />
        </div>
      )}
      {(question?.settings as CTASettings).type === CTAType.HIDDEN && null}
    </div>
  );
};
