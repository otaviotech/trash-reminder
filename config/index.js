module.exports = {
  port: process.env.PORT || 3000,
  appName: process.env.appName || 'TrashReminder',
  firebase: {
    apiKey: process.env.firebase_apiKey || 'AIzaSyCwnCYgi689lR3WtN22WZIVGfsQVrc3lcQ',
    authDomain: process.env.firebase_authDomain || 'trash-reminder-3ac7f.firebaseapp.com',
    databaseURL: process.env.firebase_databaseURL || 'https://trash-reminder-3ac7f.firebaseio.com',
    projectId: process.env.firebase_projectId || 'trash-reminder-3ac7f',
    storageBucket: process.env.firebase_storageBucket || 'trash-reminder-3ac7f.appspot.com',
    messagingSenderId: process.env.firebase_messagingSenderId || '753911454398'
  },
  slack: {
    reminderURL: process.env.slack_reminderURL,
  }
};
