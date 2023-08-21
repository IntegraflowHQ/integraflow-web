import { EventProperties, ID, UserAttributes, Event } from '../types';
import { uuidv4 } from '../utils';
import { Context } from './context';
import { getState, persistState, resetState } from './storage';

export class SyncManager {
  private readonly context: Context;

  constructor(ctx: Context) {
    this.context = ctx;
  }

  async getInstallId(): Promise<ID | undefined> {
    const state = await getState(this.context);
    return state.installId;
  }

  async getUserId(): Promise<ID | undefined> {
    const state = await getState(this.context);
    if (!state || !state.user?.id) {
      return this.getInstallId();
    }

    return state.user.id;
  }

  async identifyUser(id: ID, attributes?: UserAttributes): Promise<void> {
    const state = await getState(this.context);
    if (state.user?.id && state.user?.id !== id && state.user.id !== state.installId) {
      throw new Error('User ID cannot be changed after it has been set. You need to reset the user first.');
    }

    state.user = {
      ...(state.user ?? {}),
      ...(attributes ?? {}),
      id
    };

    await persistState(this.context, state);

    this.context.broadcast('audienceUpdated', {
      attributes: state.user
    });

    this.context.listeners.onAudienceChanged?.(state.user);
  }

  async updateUserAttribute(attributes: UserAttributes): Promise<void> {
    const state = await getState(this.context);

    const userId = state.user?.id || state.installId;

    this.identifyUser(userId!, attributes);
  }

  async reset(resetInstallId: boolean = false): Promise<void> {
    await resetState(this.context, resetInstallId);

    this.context.broadcast('audienceUpdated', {});
  }

  async trackEvent(
    name: string,
    properties?: EventProperties
  ): Promise<void> {
    const state = await getState(this.context);

    const event: Event = {
      event: name,
      uuid: uuidv4(),
      timestamp: Date.now(),
      properties,
      userId: state.user?.id
    };

    this.context.broadcast('eventTracked', {
      event,
      attributes: state.user
    });

    this.context.listeners.onEventTracked?.(event);

    // TODO: Send event to the backend
  }
}
