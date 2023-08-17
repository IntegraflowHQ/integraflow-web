import { Configuration, Survey } from '../types';

type SdkEventType = 'eventTracked' | 'userIdentified' | 'urlMatched';
export type SdkEvent<T = any> = { type: SdkEventType; data: T };
type SdkEventHandler = (event: SdkEvent) => void;

export class Context {
  readonly surveys: Survey[];
  readonly debug: boolean;

  private readonly subscribers: { [key: string]: SdkEventHandler[] };

  constructor(config: Configuration) {
    this.surveys = config.surveys || [];
    this.debug = config.debug || false;

    this.subscribers = {};
  }

  subscribe(event: SdkEventType, handler: SdkEventHandler) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    if (this.subscribers[event].indexOf(handler) > -1) {
      return;
    }

    this.subscribers[event].push(handler);
  }

  broadcast(event: SdkEventType, data: any) {
    if (!this.subscribers[event]) {
      return;
    }

    for (let i = 0; i < this.subscribers[event].length; ++i) {
      this.subscribers[event][i]({
        type: event,
        data
      });
    }
  }
}
