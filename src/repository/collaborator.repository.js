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
          const collaborator = db.get('collaborators').find({ id }).value();
          return Promise.resolve(collaborator);
        })
        .catch(err => Promise.reject(err))
    },
  };
}

module.exports = createCollaboratorRepository;
