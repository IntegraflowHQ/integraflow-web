import { h, render } from 'preact';
import { Wrapper } from './components';
import './styles/globals.css';

const App = () => {
  return (
    <Wrapper fullScreen>
      <div>hello</div>
    </Wrapper>
  );
};

render(<App />, document.getElementById('formily'));
