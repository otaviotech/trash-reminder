const firebase = require('firebase');
const firebaseConfig = require('../../config').firebase;

function createFirebaseDatabaseConnection() {
  const firebaseApp = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

  return firebaseApp.auth().signInAnonymously()
    .then(() => {
      return Promise.resolve(firebaseApp.database());
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Erro ao conectar com Firebase.');
    });
}

module.exports = createFirebaseDatabaseConnection;
