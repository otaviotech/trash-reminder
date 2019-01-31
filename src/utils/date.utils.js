const { allPass } = require('ramda');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const MOMENT_WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};
// module.exports.MOMENT_WEEKDAYS = MOMENT_WEEKDAYS;

/**
 * Informa se uma data é dia da semana
 * @param {string} date A data no formato YYYY-MM-DD.
 * @return {boolean}
 */
function isWeekDay(date) {
  const weekendDays = [
    MOMENT_WEEKDAYS.MONDAY,
    MOMENT_WEEKDAYS.SATURDAY,
  ];

  return !weekendDays.includes(moment(date).day());
}
// module.exports.isWeekDay = isWeekDay;

/**
 * Retorna uma função que verifica se um dia é feriado dada a lista de feriados passada.
 * @param {Array<string>} holidays Os feriados no formato YYYY-MM-DD.
 * @return {Function}
 */
function generateIsNotHolidayFn(holidays) {
  return day => !holidays.includes(day.format('YYYY-MM-DD'));
}

/**
 * Obtém os dias úteis em um range.
 * @param {string} from O início do range no formato YYYY-MM-DD.
 * @param {string} until O fim do range no formato YYYY-MM-DD.
 * @param {Array<string>} holidays Os feriados no formato YYYY-MM-DD.
 * @return {Array<string>}
 */
function getWorkingDaysInRange(from, until, holidays) {
  const range = moment.range(from, until);

  const isNotHoliday = generateIsNotHolidayFn(holidays);

  const onlyWorkingDays = allPass([isWeekDay, isNotHoliday]);

  const workingDays = Array.from(range.by('day')).filter(onlyWorkingDays);

  return workingDays;
}
// module.exports.getWorkingDaysInRange = getWorkingDaysInRange;

/**
 * Obtém a quantitade de dias úteis em um range.
 * @param {string} from O início do range no formato YYYY-MM-DD.
 * @param {string} until O fim do range no formato YYYY-MM-DD.
 * @param {Array<string>} holidays Os feriados no formato YYYY-MM-DD.
 * @return {number}
 */
function getWorkingDaysCountInRange(from, until, holidays) {
  return getWorkingDaysInRange(from, until, holidays).length;
}
module.exports.getWorkingDaysCountInRange = getWorkingDaysCountInRange;
