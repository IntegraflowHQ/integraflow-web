import classnames from 'classnames';
import { XIcon } from 'lucide-preact';
import { h } from 'preact';
import { PlacementType, Theme } from '../types';
import Progress from './Progress';

interface ContainerProps {
  children: preact.ComponentChildren;
  fullScreen?: boolean;
  placement?: PlacementType;
  close?: () => void;
  background?: string;
  progress: number;
  showProgressBar?: boolean;
  theme?: Theme;
}

export const Wrapper: preact.FunctionComponent<ContainerProps> = ({
  children,
  fullScreen,
  placement,
  close,
  background = '#FFFFFF',
  progress,
  showProgressBar,
  theme,
}) => {
  const showTopBar = showProgressBar || !fullScreen;

  return (
    <div
      className={
        'fixed top-0 bottom-0 left-0 right-0 bg-[#14171A33] bg-opacity-20 p-5'
      }
    >
      <div className='relative w-full h-full'>
        <div
          className={classnames(
            'absolute',
            placement === 'topLeft' && 'top-0 left-0',
            placement === 'topRight' && 'top-0 right-0',
            placement === 'bottomLeft' && 'bottom-0 left-0',
            placement === 'bottomRight' && 'bottom-0 right-0',
            placement === 'center' &&
              'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          )}
        >
          <div
            className={classnames(
              'p-6 flex flex-col justify-center items-center',
              fullScreen ? 'w-screen h-screen' : 'rounded-2xl w-fit'
            )}
            style={{ backgroundColor: background }}
          >
            {showTopBar && (
              <div
                className={classnames(
                  'flex items-center gap-2 w-full',
                  !fullScreen && !showProgressBar && 'justify-end' // Set forceClose button to the right.
                )}
              >
                {showProgressBar && (
                  <Progress bgColor={theme?.progressBar} progress={progress} />
                )}
                {!fullScreen && (
                  <button onClick={close}>
                    <XIcon />
                  </button>
                )}
              </div>
            )}

            <div
              className={classnames('flex-1', fullScreen && 'overflow-y-auto')}
            >
              {children}
            </div>

            <footer class={'mt-6'}>
              Powered by <b>Formily</b>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
