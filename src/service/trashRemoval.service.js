const moment = require('moment');
const { bauruIBGECityCode } = require('../constants');

function createTrashRemovalService ({
  calendarioService,
  trashScheduleRepository,
  collaboratorRepository,
}) {
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


            })
            .catch(err => Promise.reject(err));
        })
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });
    },
  };
};

module.exports = createTrashRemovalService;


