import Formily from '../index';

type CmdFn = (k: Formily) => void;
type Cmd = string | CmdFn;
type QueuedCommand = [Cmd, ...any[]];
type LazyFormily = { q?: QueuedCommand[] };

interface Win extends Window {
  Formily?: LazyFormily;
}

declare var window: Win;

function main() {
  if (!window.Formily?.q) {
    return;
  }

  const q = window.Formily.q;
  const init = q.find(item => item[0] === 'init');

  if (init?.length !== 2) {
    return;
  }

  if (location.protocol !== 'https:') {
    console.warn(
      'Formily: this page is not served over HTTPS, some features may be unavailable...'
    );
  }

  const instance = Formily.init(init[1]);
  const executor = function (cmd: Cmd, ...args: any[]) {
    try {
      if (typeof cmd === 'function') {
        cmd(instance);
      } else {
        (instance as any)[cmd](...args);
      }
    } catch (e) {
      console.error(e);
    }
  };

  for (let i = 0; i < q.length; ++i) {
    const cmd = q[i][0];

    if (cmd === 'init') {
      continue;
    }

    executor(...q[i]);
  }

  (window.Formily as any) = executor;
}

main();
