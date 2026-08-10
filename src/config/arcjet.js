import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const isProduction = process.env.NODE_ENV === 'production';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: isProduction ? 'LIVE' : 'DRY_RUN' }),
    detectBot({
      mode: isProduction ? 'LIVE' : 'DRY_RUN',
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
      ],
    }),
    slidingWindow({ mode: 'LIVE', interval: '2s', max: 5 }),
  ],
});

export default aj;
