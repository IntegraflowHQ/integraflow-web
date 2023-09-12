import IntegraFlow from '../index';

type CmdFn = (k: IntegraFlow) => void;
type Cmd = string | CmdFn;
type QueuedCommand = [Cmd, ...any[]];
type LazyIntegraFlow = { q?: QueuedCommand[] };

interface Win extends Window {
  IntegraFlow?: LazyIntegraFlow;
}

declare var window: Win;

function main() {
  if (!window.IntegraFlow?.q) {
    return;
  }

  const q = window.IntegraFlow.q;
  const init = q.find(item => item[0] === 'init');

  if (init?.length !== 2) {
    return;
  }

  if (location.protocol !== 'https:') {
    console.warn(
      'IntegraFlow: this page is not served over HTTPS, some features may be unavailable...'
    );
  }

  const instance = IntegraFlow.init(init[1]);
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

  (window.IntegraFlow as any) = executor;
}

main();
