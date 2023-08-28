import { Context, RootFrame } from './core';
import { SyncManager } from './core/sync';
import { SurveyManager } from './surveys';
import { Configuration, EventProperties, ID, UserAttributes } from './types';

export default class Formily {
  private readonly config: Configuration;
  private static instance: Formily;
  private readonly surveyManager: SurveyManager;
  private readonly syncManager: SyncManager;

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

    this.syncManager = new SyncManager(this.context);
  }

  static init(config: Configuration) {
    if (!this.instance) {
      this.instance = new Formily(config);
      this.initialized = true;
    }

    return this.instance;
  }

  async identify(identifier: string, attributes?: UserAttributes): Promise<void> {
    await this.syncManager.identifyUser(identifier, attributes);
  }

  async updateUserAttribute(attributes: UserAttributes): Promise<void> {
    await this.syncManager.updateUserAttribute(attributes);
  }

  async reset(resetInstallId?: boolean): Promise<void> {
    await this.syncManager.reset(resetInstallId);
  }

  async track(event: string, properties?: EventProperties): Promise<void> {
    await this.syncManager.trackEvent(event, properties);
  }

  async trackRouteChange() {
    if (typeof window === 'undefined') return;

    await this.syncManager.trackEvent('pageView', {
      title: document.title,
      url: window.location.href
    });
  }

  async registerRouteChange() {
    if (typeof window === 'undefined') return;

    window.addEventListener('hashchange', this.trackRouteChange);
    window.addEventListener('popstate', this.trackRouteChange);
    window.addEventListener('pushstate', this.trackRouteChange);
    window.addEventListener('replacestate', this.trackRouteChange);
    window.addEventListener('load', this.trackRouteChange);
  }

  showSurvey(surveyId: ID) {
    this.surveyManager.showSurvey(surveyId);
  }
}
