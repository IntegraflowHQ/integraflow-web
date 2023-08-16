import { h, render } from 'preact';
import { Wrapper } from './components';
import './styles/globals.css';
import { Button, ThankYouResponse } from './components';

const App = () => {
  return (
    <div className={'h-screen bg-blue-500 p-5'}>
      <Wrapper>
        <ThankYouResponse
          title="Thanks for your feedback"
          subtext="Have a great day!"
        />
      </Wrapper>
    </div>
  );
};

render(<App />, document.getElementById('formily'));
