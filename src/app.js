const
    path = require('path')
    fs = require('fs')
    moment = require('moment')
    restify = require('restify')
    corsMiddleware = require('restify-cors-middleware')
    createTrashRemovalService = require('./service/trashRemoval.service');

const config = require(path.resolve(__dirname, '../config'));

const cors = corsMiddleware({
    origins: ['*'],
});

const server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);

const trashRemovalService = createTrashRemovalService();

server.post('/', (req, res) => {
    const today = moment().format('YYYY-MM-DD');

    return trashRemovalService.getRemover(today)
      .then((remover) => {
        let text = remover
          ? trashRemovalService.getRemoveMessage(remover)
          : getNotRemovingDayMessage(today);

        return res.send(200, {
          response_type: 'in_channel',
          text,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.send(500, {
          response_type: 'in_channel',
          text: 'Desculpe, não foi possivel verificar quem tira o lixo hoje.',
        });
      });
});

server.listen(process.env.PORT || config.port, () => {
  console.log(`${config.appName} listening on port ${process.env.PORT || config.port}`);
});

module.exports.server = server;
