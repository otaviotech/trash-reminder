const
    path = require('path')
    fs = require('fs')
    moment = require('moment')
    restify = require('restify')
    corsMiddleware = require('restify-cors-middleware');

const config = require(path.resolve(__dirname, '../config'));

const cors = corsMiddleware({
    origins: ['*'],
    exposeHeaders: [],
})

const server = restify.createServer();
  
server.pre(cors.preflight)
server.use(cors.actual)

// Se o dia do mês, termina com:

const queue = ['Otavio', 'Thiago', 'Christian', 'Leonardo', 'Marcos', 'Felipe', 'Renata'];

server.post('/', (req, res, next) => {
    const todayIsSaturdayOrSunday = [0,6].includes(moment().day());
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const beforeYesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');
    // const today = moment().format('YYYY-MM-DD');

    if (todayIsSaturdayOrSunday) {
        res.send(200, {
            response_type: 'in_channel',
            text: `Relaxa! Hoje é ${moment().day() === 6 ? 'sábado' : 'domingo'}!`
        });
        return;
    }
    
    fs.readFile(path.resolve(__dirname, 'ultimaPessoa.txt'), 'utf8', (err, contents) => {
        if (err || !contents) return console.log('Erro 1!');

        const splited = contents.split('|');
        
        const ultimaPessoa = splited[0];
        const dia = moment(splited[1], 'YYYY-MM-DD').format('YYYY-MM-DD');

        let nextPerson = queue[queue.findIndex(i => i === ultimaPessoa) + 1];

        if (dia === yesterday) {
            res.send(200, {
                response_type: 'in_channel',
                text: `Quem tira o lixo hoje é ${nextPerson}!`
            });
            return;
        }

        if (dia === beforeYesterday) {
            const log = `${nextPerson}|${yesterday}`;

            fs.writeFile(path.resolve(__dirname, 'ultimaPessoa.txt'), log);

            res.send(200, {
                response_type: 'in_channel',
                text: `Quem tira o lixo hoje é ${nextPerson}!`
            });
        }
    });
});

server.listen(process.env.PORT, () => {
    console.log(`${config.appName} listening on port ${config.PORT}`);
});
