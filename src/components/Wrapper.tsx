import classnames from 'classnames';
import { XIcon } from 'lucide-preact';
import { h } from 'preact';

interface ContainerProps {
  children: preact.ComponentChildren;
  fullScreen?: boolean;
}

export const Wrapper: preact.FunctionComponent<ContainerProps> = ({
  children,
  fullScreen,
}) => {
  return (
    <div
      className={classnames(
        'relative bg-white p-6 flex gap-6 flex-col justify-center items-center w-fit',
        fullScreen ? 'w-screen h-screen' : 'rounded-2xl'
      )}
    >
      {!fullScreen && (
        <button className={'absolute right-6 top-6'}>
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
  );
};
