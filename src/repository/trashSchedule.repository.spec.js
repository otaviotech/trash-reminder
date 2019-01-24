const createTrashScheduleRepository = require('./trashSchedule.repository');

describe('TrashScheduleRepository', () => {
  let trashScheduleRepository;

  describe('GetLatestRemoval', () => {
    beforeEach(() => {
      trashScheduleRepository = createTrashScheduleRepository(() => Promise.resolve({
        get: () => ({
          value: () => ({
              collaboratorID: 1,
              date: '2019-01-23',
          }),
        }),
      }));
    });

    it('Deve retornar a ultima coleta de lixo.', (done) => {
        trashScheduleRepository.getLastRemoval()
          .then((lastSchedule) => {
            expect(typeof lastSchedule).toBe('object');
            expect(lastSchedule.collaboratorID).toBe(1);
            expect(lastSchedule.date).toBe('2019-01-23');
            done();
          });
    });
  });

  describe('SetLastRemoval', () => {
    beforeEach(() => {
      trashScheduleRepository = createTrashScheduleRepository(() => Promise.resolve({
        set: () => ({
          write: () => Promise.resolve(),
        }),
      }));
    });

    it('Deve atualizar a ultima coleta de lixo.', (done) => {
        trashScheduleRepository.setLastRemoval()
          .then((result) => {
            expect(result).toBeTruthy();
            done();
          });
    });
  });
});
