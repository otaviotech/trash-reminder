const createCollaboratorRepository = require('./collaborator.repository');

describe('CollaboratorRepository', () => {
  let collaboratorRepository;

  describe('Get', () => {
    beforeEach(() => {
      collaboratorRepository = createCollaboratorRepository(() => Promise.resolve({
        ref: () => ({
          once: () => Promise.resolve({
            val: () => ({
              id: 4, name: 'Otávio', slackUserID: 'UABE2LK42', message: 'Custom message.',
            }),
          }),
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

  describe('GetCollaboratorsCount', () => {
    beforeEach(() => {
      collaboratorRepository = createCollaboratorRepository(() => Promise.resolve({
        ref: () => ({
          orderByKey: () => ({
            limitToLast: () => ({
              once: () => Promise.resolve({
                val: () => ({ 0: {} }),
              }),
            }),
          }),
        }),
      }));
    });

    it('Deve buscar a quantidade de colaboradores no banco de dados.', (done) => {
      collaboratorRepository.getCollaboratorsCount()
        .then((count) => {
          expect(typeof count).toBe('number');
          expect(count).toBe(1);
          done();
        });
    });
  });
});
