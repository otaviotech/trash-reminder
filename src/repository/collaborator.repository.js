const createCollaboratorRepository = function(getDBConnection) {
  return {
    /**
     * Busca um colaborador pelo id.
     * @param {number} O id do colaborador.
     * @return {Promise<Object>}
     */
    get(id) {
      return getDBConnection()
        .then((db) => {
          const lastRemoval = db.get('collaborators').find({ id }).value();
          return Promise.resolve(lastRemoval);
        })
        .catch(err => Promise.reject(err))
    },
  };
}

module.exports = createCollaboratorRepository;
