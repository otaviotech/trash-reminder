const moment = require('moment');
const fs = require('fs');

/**
 * @function getParsedInfo
 * @description Retorna a informação gravada em disco já serializada.
 * @param {string} filePath O caminho do arquivo onde estão as informações.
 * @returns {Object} A informação serializada.
 */
const getParsedInfo = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  if (!fileContent) return undefined;

  const parsedInfo = fileContent.split('|');

  const who = parsedInfo[0];
  const when =  parsedInfo[1];

  return { who, when };
}

const TrashReminder = {
  /**
   * @function IsTrashRemovingDay
   * @description Retorna se é necessário remover o lixo em uma data.
   * @param {string} date A data que se deseja saber se é necessário remover o lixo.
   * O formato deve ser: YYYY-MM-DD
   * @returns {boolean} Se é necessário ou não remover o lixo.
   */
  IsTrashRemovingDay(date) {
    const weekDay = moment(date, 'YYYY-MM-DD').day();

    return ![0,6].includes(weekDay);
  },

  /**
   * @function GetNotRemovingDayMessage
   * @description Retorna uma mensagem dizendo que não é necessário remover o lixo.
   * @param {string} date A data em que não é necessário remover o lixo.
   * O formato deve ser: YYYY-MM-DD
   * @returns {string} A mensagem dizendo que não é necessário remover o lixo.
   */
  GetNotRemovingDayMessage(date) {
    const weekDay = moment(date, 'YYYY-MM-DD').day();

    const weekDayStr = weekDay === 0 ? 'domingo' : 'sábado';

    return `Relaxa! Hoje é ${weekDayStr}!`;
  },

  /**
   * @function GetLastTrashRemove
   * @description Retorna quem foi a última pessoa que removeu o lixo e quando.
   * @param {string} filePath O caminho do arquivo onde estão as informações.
   * @returns {Object} Um objeto que contém as informações.
   */
  GetLastTrashRemove(filePath) {
    return getParsedInfo(filePath);
  },

  /**
   * @function GetActualTrashRemove
   * @description Retorna quem é a pessoa que remove o lixo no dia corrente.
   * @param {Object} lastTrashRemove As informações de quem foi a última pessoa que retirou o lixo e quando.
   * @param {Array | string} removalList A lista contendo as pessoas que retiram o lixo.
   * Objeto: { who: 'João', when: 'YYYY-MM-DD'}
   * @returns {Object} Um objeto que contém as informações de quem retira o lixo no dia corrente.
   */
  GetActualTrashRemove(lastTrashRemove, removalList) {
    let lastRemoveIndex = removalList.findIndex(i => i === lastTrashRemove.who);

    const lastRemoveDate = moment(lastTrashRemove.when, 'YYYY-MM-DD');
    const lastRemoveWeekDay = lastRemoveDate.day();

    let who;
    let when;

    // Caso seja o último, o primeiro da lista será o próximo.
    if (lastRemoveIndex === removalList.length - 1) lastRemoveIndex = -1;

    who = removalList[lastRemoveIndex + 1];

    if (lastRemoveWeekDay === 5) when = lastRemoveDate.add(3, 'days').format('YYYY-MM-DD');
    else when = lastRemoveDate.add(1, 'days').format('YYYY-MM-DD');

    return { who, when };
  },

  SetLastTrashRemove(filePath, removalList, currentDate){
    const lastTrashRemove = getParsedInfo(filePath);
    const lastDate = moment(lastTrashRemove.when, 'YYYY-MM-DD');
    const today = moment(currentDate, 'YYYY-MM-DD');

    const actualTrashRemove = this.GetActualTrashRemove(lastTrashRemove, removalList);

    if ([2, 4].includes(today.diff(lastDate, 'days'))) {
      fs.writeFileSync(filePath, `${actualTrashRemove.who}|${today.subtract(1, 'days').format('YYYY-MM-DD')}`)
    }
  },
};

module.exports = TrashReminder;
