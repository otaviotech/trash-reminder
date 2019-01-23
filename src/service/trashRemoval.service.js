const moment = require('moment');
const { bauruIBGECityCode } = require('../constants');

function createTrashRemovalService ({ calendarioService }) {
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
    }
  }
};

module.exports = createTrashRemovalService;


