const moment = require('moment');
const { bauruIBGECityCode } = require('../constants');
const createCalendarioService = require('./calendario.service');
const createTrashScheduleRepository = require('../repository/trashSchedule.repository');
const createCollaboratorRepository = require('../repository/collaborator.repository');
const createCollaboratorService = require('./collaborator.service');

function createTrashRemovalService ({
  calendarioService = createCalendarioService(),
  trashScheduleRepository = createTrashScheduleRepository(),
  collaboratorRepository = createCollaboratorRepository(),
  collaboratorService = createCollaboratorService(),
} = {}) {
  return {
    /**
     * Verifica se é necessário tirar o lixo na data passada.
     * @param {string} date A data no formato YYYY-MM-DD
     * @return {Promise<boolean>}
     */
    isTrashRemovingDay(date) {
      const weekDay = moment(date).day();

      if ([0,6].includes(weekDay)) {
        return Promise.resolve(false);
      }

      return calendarioService.isHoliday(date, bauruIBGECityCode)
        .then((isHoliday) => Promise.resolve(!isHoliday.result))
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });
    },

    /**
     * Informa quem deve retirar o lixo na data passada.
     * @param {string} date A data no formato YYYY-MM-DD
     * @return {Promise<Object>}
     */
    getRemover(date) {
      return this.isTrashRemovingDay(date)
        .then((isTrashRemovingDay) => {
          if (!isTrashRemovingDay) {
            return Promise.resolve(undefined);
          }

          return trashScheduleRepository.getLastRemoval()
            .then((lastRemoval) => {
              if (lastRemoval.date === date) {
                return collaboratorRepository.get(lastRemoval.collaboratorID)
                  .then((collaborator) => Promise.resolve(collaborator))
                  .catch(err => Promise.reject(err));
              }

              return collaboratorService.getNextQueuedCollaborator(lastRemoval.collaboratorID)
                .then((nextQueuedCollaborator) => {
                  // Change, but async, no confirmation needed.
                  trashScheduleRepository.setLastRemoval({
                    date,
                    collaboratorID: nextQueuedCollaborator.id,
                  }).catch(console.error);

                  return nextQueuedCollaborator;
                })
                .catch(err => Promise.reject(err));

            })
            .catch(err => Promise.reject(err));
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });
    },

    /**
     * Obtém a mensagem formatada citando o colaborador.
     * @param {object} collaborator O colaborador.
     * @return {string}
     */
    getRemoveMessage(collaborator) {
      const message = `Quem tira o lixo hoje é... <@${collaborator.slackUserID}>`;
      return message;
    },

    /**
     * Retorna uma mensagem dizendo que não é necessário remover o lixo.
     * @param {string} date A data em que não é necessário remover o lixo.
     * O formato deve ser: YYYY-MM-DD
     * @returns {string} A mensagem dizendo que não é necessário remover o lixo.
     */
    getNotRemovingDayMessage(date) {
      const weekDay = moment(date, 'YYYY-MM-DD').day();

      let dayStr;

      if (weekDay === 0) dayStr = 'domingo';
      if (weekDay === 6) dayStr = 'sábado';
      if (![0, 6].includes(weekDay)) dayStr = 'feriado';

      return `Relaxa! Hoje é ${dayStr}!`;
    },
  };
};

module.exports = createTrashRemovalService;
