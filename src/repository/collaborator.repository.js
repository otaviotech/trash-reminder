const db = require('./db');

const createCollaboratorRepository = function(getDBConnection = db) {
  return {
    /**
     * Busca um colaborador pelo id.
     * @param {number} O id do colaborador.
     * @return {Promise<Object>}
     */
    get(id) {
      return getDBConnection()
        .then((db) => {
          const collaborator = db.get('collaborators').find({ id }).value();
          return Promise.resolve(collaborator);
        })
        .catch(err => Promise.reject(err))
    },

    /**
     * Busca a quantidade de colaboradores.
     * @return {Promise<number>}
     */
    getCollaboratorsCount() {
      return getDBConnection()
        .then((db) => {
          const count = db.get('collaborators').size().value();
          return Promise.resolve(count);
        })
        .catch(err => Promise.reject(err))
    },
  };
}

module.exports = createCollaboratorRepository;
