import { AnswerType, CTAType, LogicOperator, LogicSingleCondition, LogicTextCondition, Template } from '../types';

export const templates: Template[] = [
  {
    name: 'Product Market Fit (Superhuman)',
    category: 'Product Experience',
    description: 'Measure PMF by assessing how disappointed users would be if your product disappeared.',
    survey: {
      id: 1,
      name: 'Product Market Fit (Superhuman)',
      questions: [
        {
          id: 1,
          type: AnswerType.SINGLE,
          orderNumber: 1,
          label: 'How disappointed would you be if you could no longer use Formily?',
          description: 'Please select one of the following options:',
          options: [
            {
              id: 1,
              label: 'Not at all disappointed',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Somewhat disappointed',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Very disappointed',
              orderNumber: 3
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false
          }
        },
        {
          id: 2,
          type: AnswerType.SINGLE,
          orderNumber: 2,
          label: 'What is your role?',
          description: 'Please select one of the following options:',
          options: [
            {
              id: 1,
              label: 'Founder',
              orderNumber: 1
            },
            {
              id: 2,
              label: 'Executive',
              orderNumber: 2
            },
            {
              id: 3,
              label: 'Product Manager',
              orderNumber: 3
            },
            {
              id: 4,
              label: 'Product Owner',
              orderNumber: 4
            },
            {
              id: 5,
              label: 'Software Engineer',
              orderNumber: 5
            },
          ],
          settings: {
            randomize: false,
            randomizeExceptLast: false,
            logic: [{
              id: 1,
              orderNumber: 1,
              destination: 4,
              condition: LogicSingleCondition.IS,
              values: [1, 2, 3, 4]
            }, {
              id: 1,
              orderNumber: 1,
              destination: 3,
              condition: LogicSingleCondition.IS,
              values: [5]
            }]
          }
        },
        {
          id: 3,
          type: AnswerType.TEXT,
          orderNumber: 3,
          label: 'What type of people do you think would most benefit from Formily?',
          settings: {
            singleLine: false,
            logic: [{
              id: 1,
              orderNumber: 1,
              destination: 6,
              condition: LogicTextCondition.HAS_ANY_VALUE
            }]
          }
        },
        {
          id: 4,
          type: AnswerType.TEXT,
          orderNumber: 4,
          label: 'What is the main benefit you receive from Formily?',
          settings: {
            singleLine: false
          }
        },
        {
          id: 5,
          type: AnswerType.TEXT,
          orderNumber: 5,
          label: 'How can we improve our service for you?',
          description: 'Please be as specific as possible.',
          settings: {
            singleLine: false
          }
        },
        {
          id: 6,
          type: AnswerType.CTA,
          orderNumber: 6,
          label: 'Thank you!',
          description: 'We appreciate your feedback.',
          settings: {
            type: CTAType.CLOSE, 
            text: 'Close'
          }
        },
      ],
      settings: {
        recurring: false,
        recurringPeriod: 0,
        placement: 'bottomRight',
        showProgressBar: true,
      },
    },
  }
];
