const path = require('path');
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const dbSchema = require('./db.schema.json');

const adapter = new FileAsync(path.resolve(__dirname, '../../db.json'));

/**
 * Obtém uma conexão com o banco de dados(JSON).
 * @return {Promise<Object>}
 */
function getDbConnection() {
  return low(adapter)
    .then((db) => {
      return db.defaults({ id: 1 }).write()
        .then(() => { return Promise.resolve(db); })
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Erro ao conectar com o banco de dados.');
    });
}

module.exports = getDbConnection;
