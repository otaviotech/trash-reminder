const { calendarioAPIBaseURL } = require('../constants');
const moment = require('moment');

function createCalendarioService (httpClient) {
  return {
    /**
     * Busca os feriados para um ano.
     * @param {string|number} ibgeCityCode O código da cidade no IBGE.
     * @param {number} year O ano ao qual se quer saber os feriados.
     * @return {Promise<Array|String>}
     */
    getHolidays(ibgeCityCode, year) {
      const params = {
        ano: year,
        ibge: ibgeCityCode,
        json: true,
        token: process.env.CALENDARIO_API_TOKEN,
      };

      return httpClient.get(calendarioAPIBaseURL, { params })
        .then((res) => {
          if (!Array.isArray(res.data)) {
            return Promise.reject(res.data);
          }

          return Promise.resolve(res.data);
        })
        .catch((err) => {
          const errMessage = `Erro ao obter feriados. (${err})`
          return Promise.reject(errMessage);
        });
    },

    /**
     * Checa se uma data é feriado e retorna um objeto com a seguinte interface:
     *
     *    result {boolean} Se é feriado na cidade, nesta data.
     *    details {object} O objeto com as informações sobre o feriado(caso seja).
     *
     *      details tem a seguinte interface:
     *
     *        date {string} data do feriado no formato DD/MM/YYYY
     *        name {string} Nome do feriado
     *        link {string} Link para informações sobre o feriado.
     *        type {string} O tipo do feriado. Ex: Feriado nacional, Facultativo.
     *        description {String} Um texto descritivo sobre o feriado.
     *        type_code {string|number} O código numérico do tipo de feriado.
     *
     * @param {string} date A data no formato YYYY-MM-DD
     * @param {string|number} ibgeCityCode O código da cidade no IBGE.
     * @return {Promise<Object>}
     */
    async isHoliday(date, ibgeCityCode) {
      const parsedDate = moment(date);

      if (!parsedDate.isValid()) {
        return Promise.reject('Erro ao verificar se hoje é feriado. (Data inválida.)');
      }

      const holidays = await this.getHolidays(ibgeCityCode, parsedDate.year())
        .catch((err) => {
          return Promise.reject(err);
        });

      const holidayDateEquals = holiday => moment(holiday.date, 'DD/MM/YYYY').isSame(parsedDate);

      const dateIsHoliday = holidays.findIndex(holidayDateEquals) >= 0;
      const holidayDetails = holidays.find(holidayDateEquals);

      const result = {
        result: dateIsHoliday,
        details: holidayDetails,
      };

      return Promise.resolve(result);
    },
  };
}

module.exports = createCalendarioService;
