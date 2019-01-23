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
});
