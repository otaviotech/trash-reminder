const dotenv = require('dotenv');

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  dotenv.config();
}

module.exports = {
  port: process.env.PORT || 3000,
  appName: process.env.APP_NAME || 'TrashReminder',
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  },
  slack: {
    reminderURL: process.env.SLACK_REMINDER_URL,
  },
  calendario: {
    apiKey: process.env.CALENDARIO_API_KEY,
  },
};
