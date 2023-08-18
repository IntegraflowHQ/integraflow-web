import {
  Store,
  del as idbDel,
  get as idbGet,
  set as idbSet
} from './idb-keyval';
import { Configuration } from '../../types';

const store = new Store('formify', 'default');

export function get<T>(key: IDBValidKey): Promise<T> {
  return idbGet(key, store);
}

export function set<T extends any>(key: IDBValidKey, value: T): Promise<T> {
  return idbSet(key, value, store).then(() => value);
}

export function del(key: IDBValidKey): Promise<void> {
  return idbDel(key, store);
}

export function persistConfig(config: Configuration): Promise<Configuration> {
  return set<Configuration>('config', {
    surveys: config.surveys,

  });
}
