import { VNode, h } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import { ID, Survey, SurveyAnswer } from '../../types';
import Progress from '../../components/Progress';
import { cn } from '../../utils';
import Response from './Response';

interface SurveyProps {
  survey: Survey;
  close: () => void;
  onQuestionAnswered?: (
    surveyId: ID,
    questionId: ID,
    answers: SurveyAnswer[]
  ) => void;
  onSurveyCompleted?: (surveyId: ID) => void;
}

export default function Survey({
  survey,
  close,
  onQuestionAnswered,
  onSurveyCompleted,
}: SurveyProps): VNode {
  const [activeQuestionId, setActiveQuestionId] = useState(survey.questions[0].id);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  //Scroll to top when question changes
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeQuestionId]);

  useEffect(() => {
    setProgress(calculateProgress());

    function calculateProgress() {
      const index = survey.questions.findIndex((question) => question.id === activeQuestionId);
      return index / survey.questions.length;
    }
  }, [activeQuestionId, survey]);

  const resolveNextQuestion = (currentQuestionId: ID, nextQuestionId?: ID | null) => {
    if (!survey) {
      return null;
    }

    if (survey.questions.length === 0) {
      return null;
    }

    let nextQuestion = null;
    if (nextQuestionId) {
      nextQuestion = survey.questions.find(question => question.id === nextQuestionId);
    } else {
      nextQuestion = survey.questions.find(question => question.id === currentQuestionId);
    }

    return nextQuestion;
  }

  const isLastQuestion = (questionId: ID) => {
    return questionId === survey.questions[survey.questions.length - 1].id;
  }

  const onAnswered = (answers: SurveyAnswer[], nextQuestionId?: ID | null) => {
    if (!survey) {
      return;
    }

    setLoading(true);

    const nextQuestion = resolveNextQuestion(activeQuestionId, nextQuestionId);
    const finished = isLastQuestion(activeQuestionId) || nextQuestionId === -1;

    if (answers.length > 0) {
      answers[answers.length - 1].finished = finished;
    }

    onQuestionAnswered?.(survey.id, activeQuestionId, answers);

    if (!nextQuestion) {
      close();
      return;
    }

    setActiveQuestionId(nextQuestion.id);
  };

  return (
    <div>
      {survey.settings.showProgressBar && <Progress progress={progress} bgColor={survey.theme?.progressBar ?? '#050505'} />}
      <div
        ref={contentRef}
        className={cn(
          loading ? 'animate-pulse opacity-60' : '',
          'text-slate-800 font-sans px-4 py-6 sm:p-6 max-h-[80vh] overflow-y-auto'
        )}>
        {(survey.questions.map(
          (question, idx) =>
            activeQuestionId === question.id && (
              <Response
                key={question.id}
                onAnswered={onAnswered}
                question={question}
                theme={survey.theme}
                submitText={survey.settings.submitText}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
