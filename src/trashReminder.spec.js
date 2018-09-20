const moment = require('moment');
const TrashReminder = require('./trashReminder');

jest.mock('fs');

describe('TrashReminder', () => {
  const someMonday = '2018-09-17';
  const someSaturday = '2018-09-15';
  const someSunday = '2018-09-16';

  describe('IsTrashRemovingDay', () => {
    it('Deve retornar true se não for sábado nem domingo.', () => {
      const result = TrashReminder.IsTrashRemovingDay(someMonday);
      expect(result).toBeTruthy();
    });

    it('Deve retornar false se for sábado.', () => {
      const result = TrashReminder.IsTrashRemovingDay(someSaturday);
      expect(result).toBeFalsy();
    });

    it('Deve retornar false se for domingo.', () => {
      const result = TrashReminder.IsTrashRemovingDay(someSunday);
      expect(result).toBeFalsy();
    });
  });

  describe('GetNotRemovingDayMessage', () => {
    describe('Se for sábado', () => {
      it('Deve retornar uma mensagem dizendo que é sabado.', () => {
        const msg = TrashReminder.GetNotRemovingDayMessage(someSaturday);
        expect(msg).toBe('Relaxa! Hoje é sábado!');
      });

      it('Deve retornar uma mensagem dizendo que é domingo.', () => {
        const msg = TrashReminder.GetNotRemovingDayMessage(someSunday);
        expect(msg).toBe('Relaxa! Hoje é domingo!');
      });
    });
  });

  describe('GetTotalWeekDays', () => {
    it('Start maior que End', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-25', '2018-09-19');
      expect(total).toBe(0);
    });

    it('Start e End iguais', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-25', '2018-09-25');
      expect(total).toBe(1);
    });

    it('Start e End durante a semana (intervalo maior que 1 semana)', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-17', '2018-09-27');
      expect(total).toBe(9);
    });

    it('Start durante a semana e End durante final de semana  (intervalo maior que 1 semana)', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-17', '2018-09-29');
      expect(total).toBe(10);
    });

    it('Start durante final de semana e End durante semana  (intervalo maior que 1 semana)', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-16', '2018-09-27');
      expect(total).toBe(9);
    });

    it('Start durante final de semana e End durante final de semana  (intervalo maior que 1 semana)', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-16', '2018-09-29');
      expect(total).toBe(10);
    });

    it('Start durante final de semana e End durante final de semana  (intervalo maior que 1 semana)', () => {
      const total = TrashReminder.GetTotalWeekDays('2018-09-15', '2018-09-29');
      expect(total).toBe(10);
    });
  });

  describe('GetLastTrashRemove', () => {
    const mockLastTrashRemove = { who: 'João', when: '2018-01-01' };
    const lastTrashRemoveFilePath = 'ultimaPessoa.txt';
    const filesMock = {
      [lastTrashRemoveFilePath]: `${mockLastTrashRemove.who}|${mockLastTrashRemove.when}`,
    };

    require('fs').__setMockFilesWithContent(filesMock);

    it('Deve retornar quem tirou o lixo a última vez e quando.', () => {
      const lastTrashRemove = TrashReminder.GetLastTrashRemove(lastTrashRemoveFilePath);
      expect(lastTrashRemove).toEqual(mockLastTrashRemove);
    })
  });

  describe('GetActualTrashRemove', () => {
    it('Deve informar quem e quando deve retirar no dia corrente.', () => {
      const mockTrashRemoversList = ['Maria', 'João', 'Pedro', 'Madalena'];
      const mockLastTrashRemove = { who: 'Madalena', when: someMonday };
      const tuesdayAfterSomeMonday = moment(someMonday, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
      const expectedResult = { who: 'Maria', when: tuesdayAfterSomeMonday };

      const actualTrashRemove = TrashReminder.GetActualTrashRemove(mockLastTrashRemove, mockTrashRemoversList);

      expect(actualTrashRemove).toEqual(expectedResult);
    });
  });

  describe('SetLastTrashRemove', () => {
    describe('Seta ultima coleta realizada', ()=> {
      let fsMock = require('fs');
      const mockTrashRemoversList = ['Maria', 'João', 'Pedro', 'Madalena'];
      const mockLastTrashRemove = { who: 'Madalena', when: someMonday };
      const tuesday = moment(someMonday, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
      const wednesday = moment(someMonday, 'YYYY-MM-DD').add(2, 'days').format('YYYY-MM-DD');
      const lastTrashRemoveFilePath = 'ultimaPessoa.txt';

      beforeEach(() => {
        const filesMock = {
          [lastTrashRemoveFilePath]: `${mockLastTrashRemove.who}|${mockLastTrashRemove.when}`,
        };
        fsMock.__setMockFilesWithContent(filesMock);
      });

      it('Deve setar a ultima coleta se o dia corrente for 2 dias a frente da ultima coleta', () => {
        TrashReminder.SetLastTrashRemove(lastTrashRemoveFilePath, mockTrashRemoversList, wednesday);
        expect(fsMock.writeFileSync).toHaveBeenCalledWith(lastTrashRemoveFilePath, `Maria|${tuesday}`);
      });

      it('Não deve setar a ultima coleta se o dia corrente não for 2 dias a frente da ultima coleta', () => {
        TrashReminder.SetLastTrashRemove(lastTrashRemoveFilePath, mockTrashRemoversList, tuesday);
        fsMock.writeFileSync = jest.fn();
        expect(fsMock.writeFileSync).not.toHaveBeenCalled();
      });
    });
  });
});

