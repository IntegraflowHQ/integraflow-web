import { XIcon } from 'lucide-preact';
import { h } from 'preact';
import { PlacementType, Theme } from '../types';
import { calculateTextColor, cn } from '../utils';
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
  maxWidth?: string;
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
  maxWidth,
}) => {
  const showTopBar = showProgressBar || !fullScreen;

  return (
    <div
      className={
        'fixed top-0 bottom-0 left-0 right-0 bg-[#14171A33] bg-opacity-20'
      }
      id={'integraflow-content-wrapper'}
    >
      <div className='relative w-full h-full'>
        <div
          className={cn(
            'absolute',
            placement === 'topLeft' ? 'top-5 left-5' : '',
            placement === 'topRight' ? 'top-5 right-5' : '',
            placement === 'bottomLeft' ? 'bottom-5 left-5' : '',
            placement === 'bottomRight' ? 'bottom-5 right-5' : '',
            placement === 'center'
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : ''
          )}
        >
          <div
            className={cn(
              'p-6 flex flex-col justify-center items-center',
              fullScreen
                ? 'w-screen h-screen'
                : 'rounded-2xl w-fit max-h-[600px]'
            )}
            style={{
              backgroundColor: background,
              maxWidth: maxWidth ?? '100%',
            }}
          >
            {showTopBar && (
              <div
                className={cn(
                  'flex items-center gap-2 w-full mb-1',
                  !fullScreen && !showProgressBar ? 'justify-end' : '' // Set forceClose button to the right.
                )}
              >
                {showProgressBar && (
                  <Progress bgColor={theme?.progressBar} progress={progress} />
                )}
                {!fullScreen && (
                  <button onClick={close}>
                    <XIcon
                      color={calculateTextColor(theme?.background ?? '#FFFFFF')}
                    />
                  </button>
                )}
              </div>
            )}

            <div className={'flex-1 w-full h-full overflow-auto'}>
              {children}
            </div>

            <footer
              className='mt-6'
              style={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: calculateTextColor(theme?.background ?? '#FFFFFF'),
              }}
            >
              Powered by{' '}
              <a href="https://useintegraflow.com" target="_blank">
                <b style={{ fontWeight: 600, fontSize: '14px' }}>IntegraFlow</b>
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
