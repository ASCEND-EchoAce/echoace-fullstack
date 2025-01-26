export const surveyJSON = {
    title: 'EchoAce Prototype Survey',
    description: 'Let us build your skills!',
    logo: 'https://api.surveyjs.io/private/Surveys/files?name=91535dde-9570-48da-9164-22f83321a3ca',
    logoPosition: 'right',
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'tagbox',
            name: 'Industries',
            title: 'What industries are you experienced/have interest in?',
            description: "We'll use this to determine the types of skills useful for you to have.",
            hideNumber: true,
            isRequired: true,
            choices: [
              {
                value: 'Item 1',
                text: 'Finance'
              },
              {
                value: 'Item 2',
                text: 'Management'
              },
              {
                value: 'Item 3',
                text: 'Technology'
              },
              {
                value: 'Item 4',
                text: 'Energy'
              },
              {
                value: 'Item 5',
                text: 'Medical'
              },
              {
                value: 'Item 6',
                text: 'Language'
              },
              {
                value: 'Item 7',
                text: 'Media'
              }
            ],
            maxSelectedChoices: 997,
            minSelectedChoices: 1
          },
          {
            type: 'boolean',
            name: 'college or no',
            title: 'Did you got to college/university?',
            hideNumber: true,
            isRequired: true,
            swapOrder: true
          },
          {
            type: 'boolean',
            name: 'question1',
            visibleIf: '{college or no} = true',
            title: 'Did you finish your program?',
            hideNumber: true,
            swapOrder: true
          },
          {
            type: 'boolean',
            name: 'high school',
            visibleIf: '{college or no} = false',
            title: 'Did you finish High School/similar level of education?',
            hideNumber: true,
            swapOrder: true
          },
          {
            type: 'rating',
            name: 'question2',
            title: 'Where would you most like to work?',
            description: 'Treat this as a scale.',
            hideNumber: true,
            autoGenerate: false,
            rateValues: [
              {
                value: 1,
                text: 'City/Urban'
              },
              {
                value: 2,
                text: '.'
              },
              {
                value: 3,
                text: '.'
              },
              {
                value: 4,
                text: '.'
              },
              {
                value: 5,
                text: '.'
              },
              {
                value: 6,
                text: '.'
              },
              {
                value: 7,
                text: '.'
              },
              {
                value: 8,
                text: 'Rural'
              }
            ]
          },
          {
            type: 'comment',
            name: 'question3',
            title:
              'Type a list of  what skills you believe you already have. Each skill may be separated by a comma (teamwork,helping,running).',
            hideNumber: true
          }
        ]
      }
    ]
  };