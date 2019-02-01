const createCollaboratorService = require('./collaborator.service');

describe('CollaboratorService', () => {
  let collaboratorService;

  describe('GetNextQueuedCollaborator', () => {
    beforeAll(() => {
      const friday = '2019-01-19';
      const wednesdayAfterFriday = '2019-01-23';
      const holidayBetweenFridayAndWednesday = '2019-01-21';
      const holidays = [holidayBetweenFridayAndWednesday];

      collaboratorService = createCollaboratorService({
        collaboratorRepository: {
          getCollaboratorsCount: () => Promise.resolve(4),
          get: (id) => Promise.resolve({ id }),
        },

        calendarioService: {
          getHolidays: () => Promise.resolve(holidays),
        },
      });
    });
  });
});

