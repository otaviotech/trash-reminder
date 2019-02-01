const createTrashRemovalService = require('./trashRemoval.service');

describe('TrashRemovalService', () => {
  let trashRemovalService;
  const someHoliday = '2019-01-01';
  const someMonday = '2018-09-17';
  const someSaturday = '2018-09-15';
  const someSunday = '2018-09-16';

  describe('IsTrashRemovingDay', () => {
    beforeAll(() => {
      trashRemovalService = createTrashRemovalService({
        calendarioService: {
          isHoliday: () => Promise.resolve({
            result: true,
            details: { date: someHoliday },
          }),
        },
      });
    });

    it('Deve resolver e retornar false caso seja sábado.', (done) => {
      trashRemovalService.isTrashRemovingDay(someSaturday)
        .then((isTrashRemovingDay) => {
          expect(isTrashRemovingDay).toBeFalsy();
          done();
        });
    });

    it('Deve resolver e retornar false caso seja domingo.', (done) => {
      trashRemovalService.isTrashRemovingDay(someSunday)
        .then((isTrashRemovingDay) => {
          expect(isTrashRemovingDay).toBeFalsy();
          done();
        });
    });

    it('Deve resolver e retornar false caso seja feriado.', (done) => {
      trashRemovalService.isTrashRemovingDay(someHoliday)
        .then((isTrashRemovingDay) => {
          expect(isTrashRemovingDay).toBeFalsy();
          done();
        });
    });

    it('Deve resolver e retornar true caso seja dia da semana e não seja feriado.', (done) => {
      trashRemovalService = createTrashRemovalService({
        calendarioService: {
          isHoliday: () => Promise.resolve({
            result: false,
            details: undefined,
          }),
        },
      });

      trashRemovalService.isTrashRemovingDay(someMonday)
        .then((isTrashRemovingDay) => {
          expect(isTrashRemovingDay).toBeTruthy();
          done();
        });
    });
  });

  describe('GetRemoverIndexForDate', () => {
    const friday = '2019-01-18';
    const wednesdayAfterFriday = '2019-01-23';
    const holidayBetweenFridayAndWednesday = '2019-01-21';
    const holidays = [holidayBetweenFridayAndWednesday];

    beforeAll(() => {
      trashRemovalService = createTrashRemovalService({
        calendarioService: {
          isHoliday: () => Promise.resolve({
            result: false,
            details: undefined,
          }),
        },
        trashScheduleRepository: {
          getLastRemoval: () => Promise.resolve({
            date: friday, collaboratorID: 0,
          }),
        },
        collaboratorRepository: {},
      });
    });

    it('deve resolver e retornar a ultima coleta caso a data seja a mesma da ultima coleta.', () => {
      let result = trashRemovalService.getRemoverIndexForDate(
        wednesdayAfterFriday, { date: friday, collaboratorID: 2 }, 5, holidays,
      );

      expect(result).toBe(0);

      result = trashRemovalService.getRemoverIndexForDate(
        wednesdayAfterFriday, { date: friday, collaboratorID: 4 }, 5, holidays,
      );

      expect(result).toBe(2);

      result = trashRemovalService.getRemoverIndexForDate(
        wednesdayAfterFriday, { date: friday, collaboratorID: 0 }, 5, holidays,
      );

      expect(result).toBe(3);
    });
  });
});
