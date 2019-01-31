const dateUtils = require('./date.utils');

describe('DateUtils', () => {
  describe('getWorkingDaysCountInRange', () => {
    it('Deve contar apenas os dias que não são feriado, sábado ou domingo.', () => {
      const friday = '2019-01-19';
      const wednesdayAfterFriday = '2019-01-23';
      const holidayBetweenFridayAndWednesday = '2019-01-21';
      const holidays = [holidayBetweenFridayAndWednesday];

      const result = dateUtils.getWorkingDaysCountInRange(friday, wednesdayAfterFriday, holidays);

      expect(result).toBe(3);
    });
  });
});
