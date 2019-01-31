const firebase = require('firebase');
const firebaseConfig = require('../../config').firebase;

function createFirebaseDatabaseConnection() {
  // Initialize Firebase
  const config = {
    apiKey: 'AIzaSyCwnCYgi689lR3WtN22WZIVGfsQVrc3lcQ',
    authDomain: 'trash-reminder-3ac7f.firebaseapp.com',
    databaseURL: 'https://trash-reminder-3ac7f.firebaseio.com',
    projectId: 'trash-reminder-3ac7f',
    storageBucket: 'trash-reminder-3ac7f.appspot.com',
    messagingSenderId: '753911454398'
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  return firebaseApp.auth().signInAnonymously()
    .then(() => {
      return Promise.resolve(firebaseApp.database());
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Erro ao conectar com Firebase.');
    });
}

createFirebaseDatabaseConnection().then((con) => {
  con.ref('collaborators').orderByKey().limitToLast(1).once('value')
    .then(v => {
      console.log(Object.values(v.val())[0])
      process.exit(0);
    });
});

module.exports = createFirebaseDatabaseConnection;
