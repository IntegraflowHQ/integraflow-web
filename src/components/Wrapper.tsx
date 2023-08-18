import classnames from 'classnames';
import { XIcon } from 'lucide-preact';
import { h } from 'preact';
import { PlacementType } from '../types';

interface ContainerProps {
  children: preact.ComponentChildren;
  fullScreen?: boolean;
  placement?: PlacementType;
  close?: () => void;
}

export const Wrapper: preact.FunctionComponent<ContainerProps> = ({
  children,
  fullScreen,
  placement,
  close,
}) => {
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
              'bg-white p-6 flex gap-6 flex-col justify-center items-center relative',
              fullScreen ? 'w-screen h-screen' : 'rounded-2xl w-fit'
            )}
          >
            {!fullScreen && (
              <button className={'absolute right-6 top-6'} onClick={close}>
                <XIcon />
              </button>
            )}

            <div
              className={classnames(
                'flex-1',
                fullScreen ? 'overflow-y-auto' : 'pt-6'
              )}
            >
              {children}
            </div>

            <footer>
              Powered by <b>Formily</b>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
