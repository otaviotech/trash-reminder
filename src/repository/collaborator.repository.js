const db = require('../service/firebase.service');

const createCollaboratorRepository = function(getDBConnection = db) {
  return {
    /**
     * Busca um colaborador pelo id.
     * @param {number} O id do colaborador.
     * @return {Promise<Object>}
     */
    get(id) {
      return getDBConnection().then((con) => {
        return con.ref(`collaborators/${id}`).once('value')
          .then((snapshot) => {
            return Promise.resolve(snapshot.val());
          }).catch((err) => {
            console.errror(err);
            return Promise.reject(err);
          });
        })
        .catch(err => Promise.reject(err))
    },

    /**
     * Busca a quantidade de colaboradores.
     * @return {Promise<number>}
     */
    getCollaboratorsCount() {
      return getDBConnection()
        .then((con) => {
          return con.ref('collaborators').orderByKey().limitToLast(1).once('value')
            .then((snapshot) => {
              const rawLastCollaboratorKey = Object.keys(snapshot.val())[0];
              const parsedLastCollaboratorKey = Number.parseInt(rawLastCollaboratorKey);
              const count = parsedLastCollaboratorKey + 1;
              return Promise.resolve(count);
            })
            .catch((err) => {
              console.error(err);
              return Promise.reject(err);
            });
        })
        .catch(err => Promise.reject(err))
    },
  };
}

module.exports = createCollaboratorRepository;
