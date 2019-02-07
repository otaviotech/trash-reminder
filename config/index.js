module.exports = {
  port: process.env.PORT || 3000,
  appName: process.env.appName || 'TrashReminder',
  firebase: {
    apiKey: process.env.firebase_apiKey,
    authDomain: process.env.firebase_authDomain,
    databaseURL: process.env.firebase_databaseURL,
    projectId: process.env.firebase_projectId,
    storageBucket: process.env.firebase_storageBucket,
    messagingSenderId: process.env.firebase_messagingSenderId,
  },
  slack: {
    reminderURL: process.env.slack_reminderURL,
  },
  calendario: {
    apiKey: process.env.calendario_apiKey,
  }
};
