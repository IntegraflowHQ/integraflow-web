import { h, render } from 'preact';

import Formily from '..';
import {
  Context,
  RootFrame,
  RootFrameContainer,
  SdkEvent,
  TagManager,
  TargetingEngine
} from '../core';
import {
  AnswerType,
  BooleanLogic,
  DateLogic,
  FormLogic,
  ID,
  MultipleLogic,
  Question,
  QuestionSettings,
  RangeLogic,
  SingleLogic,
  Survey,
  SurveyAnswer,
  TextLogic
} from '../types';
import { deferSurveyActivation } from '../utils';

import App from './App';
import { SurveyLogic } from './logic';

export type SurveyManagerState =
  | 'loading'
  | 'ready'
  | 'running';

export class SurveyManager {
  private readonly formilyClient: Formily;
  private readonly context: Context;
  private readonly rootFrame: RootFrame;
  private readonly targetingEngine: TargetingEngine;
  private readonly surveyLogic: SurveyLogic;
  private readonly tagManager: TagManager;

  private surveyContainer: RootFrameContainer;
  private state?: SurveyManagerState;
  private surveys: Survey[];
  private activeSurveys: Survey[];

  constructor(client: Formily, ctx: Context, rootFrame: RootFrame) {
    this.surveys = [];
    this.activeSurveys = [];

    this.rootFrame = rootFrame;
    this.surveyContainer = rootFrame.createContainer('survey');
    this.formilyClient = client;
    this.context = ctx;

    this.targetingEngine = new TargetingEngine(ctx, this.onEventTracked);
    this.surveyLogic = new SurveyLogic();
    this.tagManager = new TagManager(ctx);

    this.setState('loading');
  }

  private onEventTracked = (event: SdkEvent) => {
    console.info('Survey trigger saw event', event);

    if (this.state !== 'ready') {
        console.info('Not ready, waiting on queue');
        return;
    }

    if (event.type === 'audienceUpdated') {
      return this.loadSurveys();
    }

    this.evaluateTriggers();
  }

  private async onEnter(state: SurveyManagerState) {
    switch (state) {
      case 'loading':
        await this.loadSurveys();
        this.setState('ready');
        break;
      case 'ready':
        this.evaluateTriggers();
        this.renderSurvey();
        break;
      case 'running':
        break;
    }
  }

  private onQuestionAnswered = async (surveyId: ID, questionId: ID, answers: SurveyAnswer[]) => {
    await this.formilyClient.persistSurveyAnswers(surveyId, questionId, answers);
  }

  private onSurveyDisplayed = async (surveyId: ID) => {
    await this.formilyClient.markSurveyAsSeen(surveyId);
  }

  private onSurveyClosed = async (surveyId: ID) => {
    await this.formilyClient.closeSurvey(surveyId);
  }

  private onSurveyCompleted = async (surveyId: ID) => {
    await this.formilyClient.markSurveyAsCompleted(surveyId);
  }

  private getNextQuestionId = (question: Question, answers: SurveyAnswer[]): ID | null => {
    const { type, settings } = question;

    const logic = (settings as QuestionSettings<any>).logic;
    if (!logic) {
      return null;
    }
  
    let nextQuestionId = null;
    switch (type) {
      case AnswerType.TEXT:
        nextQuestionId = this.surveyLogic.getTextQuestionDestination(answers[0].answer ?? null, (logic as TextLogic[]));
        break;
      case AnswerType.SINGLE:
        nextQuestionId = this.surveyLogic.getSingleQuestionDestination(answers[0].answerId ?? null, (logic as SingleLogic[]));
        break;
      case AnswerType.MULTIPLE:
        const answerIds = (answers || []).map(answer => answer.answerId!).filter(answer => !!answer);
        nextQuestionId = this.surveyLogic.getMultipleQuestionDestination(answerIds ?? null, (logic as MultipleLogic[]));
        break;
      case AnswerType.DATE:
        nextQuestionId = this.surveyLogic.getDateQuestionDestination(answers[0].answer ?? null, (logic as DateLogic[]));
        break;
      case AnswerType.BOOLEAN:
        nextQuestionId = this.surveyLogic.getBooleanQuestionDestination(answers[0].answer ? parseInt(answers[0].answer) : null, (logic as BooleanLogic[]));
        break;
      case AnswerType.FORM:
        const answerMap: { [key: ID]: string | null; } = {};
        for (const ans of answers) {
          const { answer, answerId } = ans;
          if (answerId) {
            answerMap[answerId] = answer ?? null;
          }
        }

        nextQuestionId = this.surveyLogic.getFormQuestionDestination(answerMap, (logic as FormLogic[]));
        break;
      case AnswerType.CSAT:
      case AnswerType.NPS:
      case AnswerType.NUMERICAL_SCALE:
      case AnswerType.RATING:
      case AnswerType.SMILEY_SCALE:
        nextQuestionId = this.surveyLogic.getRangeQuestionDestination((answers[0].answerId as number) ?? null, (logic as RangeLogic[]));
        break;
    }

    return nextQuestionId;
  }

  private setState(state: SurveyManagerState) {
    console.info('Setting survey manager state:' + state);
    this.state = state;
    this.onEnter(state);
  }

  hideSurvey(surveyId: ID) {
    const name = this.surveyContainer.name;
    this.rootFrame.removeContainer(name);
    this.surveyContainer = this.rootFrame.createContainer(name)

    const idx = this.activeSurveys.findIndex(survey => survey.id === surveyId);
    if (idx === -1) {
      this.setState('ready');
      return;
    }

    this.activeSurveys.splice(idx, 1);

    this.setState('ready');
  }

  private renderSurvey(survey?: Survey) {
    if (survey) {
      this.render(survey);
      return;
    }

    if (this.activeSurveys.length > 0) {
      this.render(this.activeSurveys[0]);
    }
  }

  private render(survey: Survey) {
    if (!this.state || !survey) {
      return;
    }

    if (this.state !== 'ready') {
      return;
    }

    this.setState('running');

    const orderedQuestions = survey.questions.sort((a, b) => a.orderNumber - b.orderNumber);
    survey.questions = orderedQuestions;

    render(
      <App
        survey={survey}
        replaceTags={this.tagManager.replaceTags}
        getNextQuestionId={this.getNextQuestionId}
        onQuestionAnswered={this.onQuestionAnswered}
        onSurveyDisplayed={this.onSurveyDisplayed}
        onSurveyClosed={this.onSurveyClosed}
        onSurveyCompleted={this.onSurveyCompleted}
      />,
      this.surveyContainer.element
    );
  }

  private async loadSurveys(): Promise<void> {
    const state = this.context.state;

    if (state?.surveys?.length === 0) {
      return Promise.resolve();
    }

    for (let survey of (state?.surveys || [])) {
      const isMatched = this.targetingEngine.evaluateAttributes(survey, state?.user);
      if (isMatched) {
        this.surveys.push(survey);
      }
    }

    return Promise.resolve();
  }

  private evaluateTriggers() {
    const matchedSurveys = this.targetingEngine.filterSurveys(this.surveys);

    this.activateSurveys(matchedSurveys);
  }

  private activateSurvey(survey: Survey) {
    if ((this.activeSurveys.findIndex(activeSurvey => survey.id === activeSurvey.id)) > -1) {
      return;
    }

    this.activeSurveys.push(survey);
  }

  private activateSurveys(surveys: Survey[]) {
    console.info('Will activate surveys: ', surveys);

    for (let i = 0; i < surveys.length; ++i) {
      const survey = surveys[i];

      if (deferSurveyActivation(survey, this.activateDeferredSurvey)) {
        continue;
      }

      this.activateSurvey(survey);
    }

    this.renderSurvey();
  }

  private activateDeferredSurvey(survey: Survey) {
    this.activateSurvey(survey as Survey);
    this.renderSurvey();
  }

  showSurvey(surveyId: ID) {
    const survey = this.context.surveys?.find(survey => survey.id === surveyId);

    if (survey) {
      const idx = this.activeSurveys.findIndex(survey => survey.id === surveyId);
      if (idx >= 0) {
        this.activeSurveys.splice(idx, 1);
      }

      this.activeSurveys.unshift(survey);
      this.renderSurvey();
    }
  }
}
