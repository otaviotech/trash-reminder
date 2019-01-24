const createCollaboratorService = require('./collaborator.service');

describe('CollaboratorService', () => {
  let collaboratorService;

  describe('GetNextQueuedCollaborator', () => {
    beforeAll(() => {
      collaboratorService = createCollaboratorService({
        collaboratorRepository: {
          getCollaboratorsCount: () => Promise.resolve(4),
          get: () => Promise.resolve({ id: 1 }),
        },
      });
    });

    it('Deve retornar o primeiro colaborador caso seja o id do último', (done) => {
      collaboratorService.getNextQueuedCollaborator(4)
        .then((nextQueuedColaborator) => {
          expect(typeof nextQueuedColaborator).toEqual('object');
          expect(nextQueuedColaborator.id).toEqual(1);
          done();
        });
    });

    it('Deve retornar o proxumo colaborador caso não seja o id do último', (done) => {
      collaboratorService = createCollaboratorService({
        collaboratorRepository: {
          getCollaboratorsCount: () => Promise.resolve(4),
          get: () => Promise.resolve({ id: 3 }),
        },
      });

      collaboratorService.getNextQueuedCollaborator(2)
        .then((nextQueuedColaborator) => {
          expect(typeof nextQueuedColaborator).toEqual('object');
          expect(nextQueuedColaborator.id).toEqual(3);
          done();
        });
    });
  });
});

