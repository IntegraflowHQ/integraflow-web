import './styles/globals.css';
import { h, render } from 'preact';
import SecondApp from './surveys/App';
import { AnswerType, CTAType, Survey } from './types';

const survey: Survey = {
  id: 'dka',
  theme: {
    question: 'green',
    answer: '#FF0000',
    button: 'red',
    background: 'yellowgreen',
    progressBar: 'blue',
  },
  questions: [
    {
      id: 1,
      label:
        'Could you please fill out our quick survey  Could you please fill out our quick survey Could you please fill out our quick surveyCould you please fill out our quick surveyCould you please fill out our quick surveyCould you please fill out our quick surveyCould you please fill out our quick surveyCould you please fill out our quick survey',
      type: AnswerType.TEXT,
      maxPath: 4,
      settings: {
        type: CTAType.NEXT,
        text: 'Submit',
        singleLine: true,
      },
      description: 'It will only take a few minutes',
    },
    {
      id: 1,
      label: 'How was your experience?',
      type: AnswerType.SMILEY_SCALE,
      maxPath: 4,
      settings: {
        text: 'Very Unsatisfied Very Satisfied',
        leftText: 'Very Unsatisfied Very Satisfied',
        rightText: 'Very Satisfied  Very Unsatisfied',
        count: 5,
      },
      description: 'It will only take a few minutes',
      options: [
        {
          id: 1,
          label: '',
          orderNumber: 1,
        },
        {
          id: 2,
          label: '',
          orderNumber: 2,
        },
        {
          id: 2,
          label: '',
          orderNumber: 3,
        },
        {
          id: 2,
          label: '',
          orderNumber: 4,
        },
        {
          id: 2,
          label: '',
          orderNumber: 5,
        },
      ],
    },
  ],
  settings: {
    placement: 'center',
    recurring: true,
    recurringPeriod: 20,
    showProgressBar: true,
  },
  type: 'hello',
};

export default function App() {
  return (
    <div>
      <SecondApp survey={survey} />
    </div>
  );
}

render(<App />, document.getElementById('formily')!);
