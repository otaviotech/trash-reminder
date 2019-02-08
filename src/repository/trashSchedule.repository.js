const db = require('../service/firebase.service');

function createTrashScheduleRepository(getDBConnection = db) {
  return {
    /**
     * Busca a ultima coleta de lixo.
     * @return {Promise<Object>}
     */
    getLastRemoval() {
      return getDBConnection()
        .then(con => con.ref('lastRemoval').once('value')
          .then((snapshot) => {
            const lastRemoval = snapshot.val();
            return Promise.resolve(lastRemoval);
          })
          .catch((err) => {
            console.error(err);
            return Promise.reject('Erro ao obter última coleta.');
          }))
        .catch(err => Promise.reject(err));
    },

    /**
     * Atualizada a ultima coleta de lixo.
     * @return {Promise<boolean>}
     */
    setLastRemoval(lastRemoval) {
      return getDBConnection()
        .then(con => con.ref('lastRemoval').set(lastRemoval)
          .then(() => Promise.resolve(true))
          .catch(() => Promise.reject(false)))
        .catch(err => Promise.reject(err));
    },
  };
}

module.exports = createTrashScheduleRepository;
