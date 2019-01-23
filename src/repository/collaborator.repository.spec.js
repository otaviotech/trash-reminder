const createCollaboratorRepository = require('./collaborator.repository');

describe('CollaboratorRepository', () => {
  let collaboratorRepository;

  describe('Get', () => {
    beforeEach(() => {
      collaboratorRepository = createCollaboratorRepository(() => Promise.resolve({
        get: () => ({
          find: () => ({
            value: () => ({
              id: 4, name: 'Otávio', slackUserID: 'UABE2LK42', message: 'Custom message.',
            }),
          })
        }),
      }));
    });

    it('Deve buscar um colaborador no banco de dados usando o id.', (done) => {
        collaboratorRepository.get(4)
          .then((collaborator) => {
            expect(typeof collaborator).toBe('object');
            expect(collaborator.id).toBe(4);
            expect(collaborator.name).toBe('Otávio');
            expect(collaborator.slackUserID).toBe('UABE2LK42');
            expect(collaborator.message).toBe('Custom message.');
            done();
          });
    });
  });
});
