import { h, render } from 'preact';

import Formily from '..';
import { Context, RootFrame, RootFrameContainer, SdkEvent } from '../core';
import { ID, Survey, SurveyAnswer, UserAttributes } from '../types';
import { deferSurveyActivation } from '../utils';
import App from './App';
import { TargetingEngine } from '../core/targeting';
import { getState } from '../core/storage';

export type SurveyManagerState =
  | 'loading'
  | 'ready'
  | 'requesting'
  | 'requesting-silent'
  | 'requesting-silent-dismissed'
  | 'postaction';

export class SurveyManager {
  private readonly formilyClient: Formily;
  private readonly context: Context;
  private readonly surveyContainer: RootFrameContainer;
  private readonly targetingEngine: TargetingEngine;

  private state?: SurveyManagerState;
  private surveys: Survey[];
  private activeSurveys: Survey[];

  constructor(client: Formily, ctx: Context, rootFrame: RootFrame) {
    this.surveys = [];
    this.activeSurveys = [];

    this.surveyContainer = rootFrame.createContainer('survey');
    this.formilyClient = client;
    this.context = ctx;

    this.targetingEngine = new TargetingEngine(ctx, this.onEventTracked);

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
};

  private setState(state: SurveyManagerState) {
    console.info('Setting survey manager state:' + state);
    this.state = state;
    this.onEnter(state);
  }

  private async onEnter(state: SurveyManagerState) {
    switch (state) {
      case 'loading':
        await this.loadSurveys();
        this.setState('ready');
        break;
      case 'ready':
        await this.evaluateTriggers();
        this.render();
        break;
    }
  }

  private async onQuestionAnswered(surveyId: ID, questionId: ID, answer: SurveyAnswer) {
    // TODO: Perform some async actions.
    this.context.listeners.onQuestionAnswered?.(surveyId, questionId, answer);
  }

  private async onSurveyDisplayed(surveyId: ID) {
    // TODO: Perform some async actions.
    this.context.listeners.onSurveyDisplayed?.(surveyId);
  }

  private async onSurveyClosed(surveyId: ID) {
    // TODO: Perform some async actions. Probably display a new survey, if available
    this.context.listeners.onSurveyClosed?.(surveyId);
  }

  private async onSurveyCompleted(surveyId: ID) {
    // TODO: Perform some async actions. Probably display a new survey, if available
    this.context.listeners.onSurveyCompleted?.(surveyId);
  }

  private render() {
    if (!this.state || this.activeSurveys.length === 0) {
      return;
    }

    render(
        <App
          survey={this.activeSurveys[0]}
          onQuestionAnswered={this.onQuestionAnswered}
          onSurveyDisplayed={this.onSurveyDisplayed}
          onSurveyClosed={this.onSurveyClosed}
          onSurveyCompleted={this.onSurveyCompleted}
        />,
        this.surveyContainer.element
    );
  }

  private async loadSurveys(): Promise<void> {
    const state = await getState(this.context);

    if (state.surveys?.length === 0) {
      return Promise.resolve();
    }

    for (let survey of (state.surveys || [])) {
      const isMatched = this.targetingEngine.evaluateAttributes(survey, state.user);
      if (isMatched) {
        this.surveys.push(survey);
      }
    }

    return Promise.resolve();
  }

  private evaluateTriggers() {
    console.info('Evaluating survey triggers');

    const matchedSurveys = this.targetingEngine.filterSurveys(this.surveys);

    this.activateSurveys(matchedSurveys);
  }

  private evaluateAttributes(survey: Survey, attributes: UserAttributes) {
    console.info('Evaluating survey attributes');
    return this.targetingEngine.evaluateAttributes(survey)
  }

  private activateSurvey(survey: Survey) {
    if (this.activeSurveys.indexOf(survey) > -1) {
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

    this.render();
  }

  private activateDeferredSurvey(survey: Survey) {
    this.activateSurvey(survey as Survey);
    this.render();
  }
}
