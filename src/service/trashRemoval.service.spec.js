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

  describe('GetRemover', () => {
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
            date: '2019-01-02', collaboratorID: 4,
          }),
        },
        collaboratorRepository: {
          get: () => Promise.resolve({ id: 4, name: 'Otávio', slackUserID: 'UABE2LK42', message: 'Custom message' }),
        },
      });
    });

    it('deve resolver e retornar a ultima coleta caso a data seja a mesma da ultima coleta.', (done) => {
      trashRemovalService.getRemover('2019-01-02')
        .then((todaysRemover) => {
          expect(todaysRemover.id).toBe(4);
          expect(todaysRemover.name).toBe('Otávio');
          expect(todaysRemover.slackUserID).toBe('UABE2LK42');
          expect(todaysRemover.message).toBe('Custom message');
          done();
        });
    });
  });
});
