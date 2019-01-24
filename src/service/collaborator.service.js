const createCollaboratorRepository = require('../repository/collaborator.repository');

function createCollaboratorService ({
  collaboratorRepository = createCollaboratorRepository(),
} = {}) {
  return {
    /**
     * Busca o próximo colaborador na fila.
     * @param {number} id O id do colaborador atual.
     * @return {Promise<Object>}
     */
    getNextQueuedCollaborator(currentCollaboratorID) {
      return collaboratorRepository.getCollaboratorsCount()
        .then((count) => {
          const currentIsLast = (count === currentCollaboratorID);

          const nextID = currentIsLast ? 0 : (currentCollaboratorID + 1);

          return collaboratorRepository.get(nextID);
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(err)
        });
    },
  };
}

module.exports = createCollaboratorService;
