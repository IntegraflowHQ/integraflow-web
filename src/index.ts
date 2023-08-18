import { Context, RootFrame } from './core';
import { SurveyManager } from './surveys';
import { Configuration, EventProperties, UserAttributes } from './types';

export default class Formily {
  private readonly config: Configuration;
  private static instance: Formily;
  private readonly surveyManager: SurveyManager;

  private static initialized: boolean = false;
  private readonly context: Context;

  private readonly rootFrame: RootFrame;

  constructor(config: Configuration) {
    this.config = config;
    this.context = new Context(config);

    this.rootFrame = new RootFrame();

    this.surveyManager = new SurveyManager(
      this,
      this.context,
      this.rootFrame
    );
  }

  static init(config: Configuration) {
    if (!this.instance) {
      this.instance = new Formily(config);
      this.initialized = true;
    }
  }

  async identify(identifier: string, attributes?: UserAttributes): Promise<void> {
    // TODO: Persist user attributes in a local storage then send to the server
  }

  async logout(): Promise<void> {
    // Clear user and survey data from local storage
  }

  async track(event: string, properties?: EventProperties): Promise<void> {
    // TODO: Track user events
  }

  async registerRouteChange() {
    // TODO: Add url change listener for SPA
  }
}
