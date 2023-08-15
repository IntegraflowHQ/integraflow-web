import { h, render } from 'preact';
import './styles/globals.css';

const App = () => {
  return (
    <div className='bg-green-400 text-white h-screen border-5 border-white'>
      App
    </div>
  );
};

render(<App />, document.getElementById('formily'));
