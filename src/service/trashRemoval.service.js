const moment = require('moment');
const dateUtils = require('../utils/date.utils');
const { bauruIBGECityCode } = require('../constants');
const createCalendarioService = require('./calendario.service');
const createTrashScheduleRepository = require('../repository/trashSchedule.repository');
const createCollaboratorRepository = require('../repository/collaborator.repository');

function createTrashRemovalService ({
  calendarioService = createCalendarioService(),
  trashScheduleRepository = createTrashScheduleRepository(),
  collaboratorRepository = createCollaboratorRepository(),
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
     * Calcula o índice do próximo colaborador na fila.
     * @param {string} date A data no formato YYYY-MM-DD.
     * @param {object} lastRemoval A última coleta.
     * @param {number} collaboratorsCount A quantidade de pessoas na fila.
     * @param {Array<string>} holidays Os feriados.
     * @return {number}
     */
    getRemoverIndexForDate(date, lastRemoval, collaboratorsCount, holidays) {
      const workingDaysCountSinceLastRemoval = dateUtils.getWorkingDaysCountInRange(
        lastRemoval.date, date, holidays,
      );

      const stepsAhead = workingDaysCountSinceLastRemoval % collaboratorsCount;
      const parcialNextCollaboratorIndex = stepsAhead + lastRemoval.collaboratorID;
      const nextCollaboratorIndex = (parcialNextCollaboratorIndex % collaboratorsCount);

      return nextCollaboratorIndex;
    },

    /**
     * Informa quem deve retirar o lixo na data passada.
     * @param {string} date A data no formato YYYY-MM-DD
     * @return {Promise<Object>}
     */
    async getRemoverForDate(date) {
      const checkingDate = moment(date);

      try {
        const dateIsTrashRemovingDay = await this.isTrashRemovingDay(date);

        if (!dateIsTrashRemovingDay) {
          return Promise.resolve(undefined);
        }

        const lastRemoval = await trashScheduleRepository.getLastRemoval();
        const holidays = await calendarioService.getHolidays(bauruIBGECityCode, checkingDate.year());
        const collaboratorsCount = await collaboratorRepository.getCollaboratorsCount();
        const nextRemoverID = await this.getRemoverIndexForDate(date, lastRemoval, collaboratorsCount, holidays);
        const nextRemover = await collaboratorRepository.get(nextRemoverID);

        console.log(nextRemover);

        return Promise.resolve(nextRemover);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
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

      if (weekDay === dateUtils.MOMENT_WEEKDAYS.MONDAY)
        dayStr = 'domingo';

      if (weekDay === dateUtils.MOMENT_WEEKDAYS.SATURDAY)
        dayStr = 'sábado';

      if (dateUtils.isWeekDay(weekDay))
        dayStr = 'feriado';

      return `Relaxa! Hoje é ${dayStr}!`;
    },
  };
};

module.exports = createTrashRemovalService;
