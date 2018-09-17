const
    path = require('path')
    fs = require('fs')
    moment = require('moment')
    restify = require('restify')
    corsMiddleware = require('restify-cors-middleware')
    TrashReminder = require('./trashReminder');

const config = require(path.resolve(__dirname, '../config'));

const cors = corsMiddleware({
    origins: ['*'],
});

const server = restify.createServer();

server.pre(cors.preflight)
server.use(cors.actual)

const queue = ['Christian', 'Felipe', 'Thiago', 'Otávio', 'Renata', 'Marcos', 'Leonardo'];

server.post('/', (req, res) => {
    const today = moment().format('YYYY-MM-DD');

    if (!TrashReminder.IsTrashRemovingDay(today)) {
        res.send(200, {
          response_type: 'in_channel',
          text: TrashReminder.GetNotRemovingDayMessage(today),
        });
        return;
    }

    TrashReminder.SetLastTrashRemove(path.resolve(__dirname, 'ultimaPessoa.txt'), queue, today);

    const lastTrashRemove = TrashReminder.GetLastTrashRemove(path.resolve(__dirname, 'ultimaPessoa.txt'));
    const actualTrashRemove = TrashReminder.GetActualTrashRemove(lastTrashRemove, queue);

    res.send(200, {
      response_type: 'in_channel',
      text: `Quem tira o lixo hoje é... ${actualTrashRemove.who}!`,
    });
});

server.listen(process.env.PORT || config.port, () => {
    console.log(`${config.appName} listening on port ${process.env.PORT || config.port}`);
});
