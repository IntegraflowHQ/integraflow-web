import { VNode, h } from 'preact';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import { ID, Question, Survey, SurveyAnswer } from '../../types';
import Progress from '../../components/Progress';
import { cn } from '../../utils';
import Response from './Response';

interface SurveyProps {
  survey: Survey;
  close: () => void;
  getNextQuestionId: (question: Question, answers: SurveyAnswer[]) => ID | null;
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
  getNextQuestionId
}: SurveyProps): VNode {
  const [activeQuestion, setActiveQuestion] = useState(survey.questions[0]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  //Scroll to top when question changes
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeQuestion]);

  useEffect(() => {
    setProgress(calculateProgress());

    console.log('Here');

    function calculateProgress() {
      const index = survey.questions.findIndex((question) => question.id === activeQuestion.id);
      return index / survey.questions.length;
    }
  }, [activeQuestion, survey]);

  const resolveNextQuestion = useCallback((answers: SurveyAnswer[]) => {
    if (!survey || !activeQuestion) {
      return null;
    }

    if (survey.questions.length === 0) {
      return null;
    }

    const nextQuestionId = getNextQuestionId(activeQuestion, answers);

    let nextQuestion = null;
    if (nextQuestionId) {
      nextQuestion = survey.questions.find(question => question.id === nextQuestionId);
      console.log('resolveNextQuestion', nextQuestionId, nextQuestion);
    } else {
      const index = survey.questions.findIndex(question => question.id === activeQuestion.id);
      console.log('resolveNextQuestion', activeQuestion.id, index);

      if (index >= 0 && ((index + 1) < survey.questions.length)) {
        nextQuestion = survey.questions[index + 1];
      }
    }

    return nextQuestion;
  }, [survey, activeQuestion])

  const isLastQuestion = useCallback((questionId: ID) => {
    return questionId === survey.questions[survey.questions.length - 1].id;
  }, [survey])

  const onAnswered = useCallback((answers: SurveyAnswer[]) => {
    if (!survey) {
      return;
    }

    setLoading(true);

    const nextQuestion = resolveNextQuestion(answers);
    const finished = isLastQuestion(activeQuestion.id);

    if (answers.length > 0) {
      answers[answers.length - 1].finished = finished;
    }

    onQuestionAnswered?.(survey.id, activeQuestion.id, answers);

    setLoading(false);

    if (finished || !nextQuestion) {
      onSurveyCompleted?.(survey.id);

      close();
      return;
    }

    setActiveQuestion(nextQuestion);
  }, [survey, activeQuestion]);

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
            activeQuestion.id === question.id && (
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
