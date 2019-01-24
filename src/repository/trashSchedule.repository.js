const db = require('./db');

const createTrashScheduleRepository = function(getDBConnection = db) {
  return {
    /**
     * Busca a ultima coleta de lixo.
     * @return {Promise<Object>}
     */
    getLastRemoval() {
      return getDBConnection()
        .then((db) => {
          const lastRemoval = db.get('lastRemoval').value();
          return Promise.resolve(lastRemoval);
        })
        .catch(err => Promise.reject(err))
    },

    /**
     * Atualizada a ultima coleta de lixo.
     * @return {Promise<boolean>}
     */
    setLastRemoval(lastRemoval) {
      return getDBConnection()
        .then((db) => {
          return db.set('lastRemoval', lastRemoval).write()
            .then(() => Promise.resolve(true))
            .catch(() => Promise.reject(false));
        })
        .catch(err => Promise.reject(err))
    },
  };
}

module.exports = createTrashScheduleRepository;
