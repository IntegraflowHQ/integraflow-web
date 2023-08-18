import { h, render } from 'preact';

import Formily from '..';
import { Context, RootFrame, RootFrameContainer } from '../core';
import { ID, Survey } from '../types';
import { deferSurveyActivation } from '../utils';
import App from './App';

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

  private state?: SurveyManagerState;
  private surveys: Survey[];
  private activeSurveys: Survey[];

  constructor(client: Formily, ctx: Context, rootFrame: RootFrame) {
    this.surveys = [];
    this.activeSurveys = [];

    this.surveyContainer = rootFrame.createContainer('survey');
    this.formilyClient = client;
    this.context = ctx;

    this.setState('loading');
  }

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

  private async onQuestionAnswered(surveyId: ID) {
    // TODO: Perform some async actions.
  }

  private async onSurveyDisplayed(surveyId: ID) {
    // TODO: Perform some async actions.
  }

  private async onSurveyClosed(surveyId: ID) {
    // TODO: Perform some async actions. Probably display a new survey, if available
  }

  private async onSurveyCompleted(surveyId: ID) {
    // TODO: Perform some async actions. Probably display a new survey, if available
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
    // TODO: Load surveys from the backend to get the latest updates

    if (this.context.surveys.length > 0) {
      this.surveys = [...this.context.surveys];
    }

    for (let survey of this.surveys) {
      // TODO: Evaluate survey audience to ensure the right people are targeted.
    }

    return Promise.resolve();
  }

  private async evaluateTriggers() {
    console.info('Evaluating survey triggers');

    // TODO: Evaluate survey triggers to ensure the right people are targeted.
    const matchedSurveys = [...this.surveys];

    this.activateSurveys(matchedSurveys);
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
