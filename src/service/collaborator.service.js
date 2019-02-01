const moment = require('moment');
const { bauruIBGECityCode } = require('../constants');
const createCollaboratorRepository = require('../repository/collaborator.repository');
const createCalendarioService = require('../service/calendario.service');
const dateUtils = require('../utils/date.utils');

function createCollaboratorService ({
  collaboratorRepository = createCollaboratorRepository(),
  calendarioService = createCalendarioService(),
} = {}) {
  return {
    /**
     * Busca o próximo colaborador na fila.
     * @param {object} lastRemoval A última coleta.
     * @return {Promise<Object>}
     */
    getNextQueuedCollaborator(lastRemoval) {
      const currentDate = moment();
      return collaboratorRepository.getCollaboratorsCount()
        .then((collaboratorsCount) => {
          return calendarioService.getHolidays(bauruIBGECityCode, currentDate.year())
            .then((holidays) => {
              const workingDaysCountSinceLastRemoval = dateUtils.getWorkingDaysCountInRange(
                lastRemoval.date, currentDate.format('YYYY-MM-DD'), holidays,
              );

              const stepsAhead = workingDaysCountSinceLastRemoval % collaboratorsCount;
              const parcialNextCollaboratorIndex = stepsAhead + lastRemoval.collaboratorID;
              const nextCollaboratorIndex = parcialNextCollaboratorIndex % collaboratorsCount;

              return collaboratorRepository.get(nextCollaboratorIndex);
            })
            .catch()
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(err)
        });
    },
  };
}

module.exports = createCollaboratorService;
