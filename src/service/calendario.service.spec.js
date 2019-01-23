const axios = require('axios');
const createCalendarioService = require('./calendario.service');

describe('CalendarioService', () => {
  let calendarioService;

  describe('GetHolidays', () => {
    it('deve resolver e retornar uma lista de feriados', (done) => {
      calendarioService = createCalendarioService({
        get(url, config) {
          return Promise.resolve({
            // `data` is the response that was provided by the server
            data: [
              {
                date: "01/01/2018",
                name: "Ano Novo",
                link: "http://www.calendario.com.br/feriados-nacionais/ano-novo.php",
                type: "Feriado Nacional",
                description: "O Ano-Novo ou Réveillon é um evento que acontece quando uma cultura celebra o fim de um ano e o começo do próximo. A celebração do evento é também chamada Réveillon, termo oriundo do verbo francês réveiller, que em português significa DESPERTAR",
                'type_code': "1"
              },
              {
                date: "12/02/2018",
                name: "Carnaval",
                link: "http://www.calendario.com.br/feriados-nacionais/carnaval.php",
                type: "Facultativo",
                description: "Ponto Facultativo, ou seja, cabe às empresas e orgão públicos decidirem se trabalharão ou não.",
                'type_code': "4"
              },
            ],

            // `status` is the HTTP status code from the server response
            status: 200,

            // `statusText` is the HTTP status message from the server response
            statusText: 'OK',

            // `headers` the headers that the server responded with
            // All header names are lower cased
            headers: {},

            // `config` is the config that was provided to `axios` for the request
            config: {},

            // `request` is the request that generated this response
            // It is the last ClientRequest instance in node.js (in redirects)
            // and an XMLHttpRequest instance the browser
            request: {}
          });
        },
      });

      calendarioService.getHolidays('123213', 2017)
        .then((holidays) => {
          expect(holidays).toHaveLength(2);
          done();
        });
    });

    it('deve rejeitar e retornar uma mensagem de erro caso não seja possivel buscar os feriados.', (done) => {
      calendarioService = createCalendarioService({
        get(url, config) {
          return Promise.reject({
            data: {},
            status: 400,
            statusText: '',
            headers: {},
            config: {},
            request: {}
          });
        },
      });

      calendarioService.getHolidays('123213', 2017)
        .then(done)
        .catch((error) => {
          expect(typeof error).toBe('string');
          done();
        });
    });
  });

  describe('IsHoliday', () => {
    beforeEach(() => {
      calendarioService = createCalendarioService({
        get(url, config) {
          return Promise.resolve({
            // `data` is the response that was provided by the server
            data: [
              {
                date: "01/01/2018",
                name: "Ano Novo",
                link: "http://www.calendario.com.br/feriados-nacionais/ano-novo.php",
                type: "Feriado Nacional",
                description: "O Ano-Novo ou Réveillon é um evento que acontece quando uma cultura celebra o fim de um ano e o começo do próximo. A celebração do evento é também chamada Réveillon, termo oriundo do verbo francês réveiller, que em português significa DESPERTAR",
                'type_code': "1"
              },
              {
                date: "12/02/2018",
                name: "Carnaval",
                link: "http://www.calendario.com.br/feriados-nacionais/carnaval.php",
                type: "Facultativo",
                description: "Ponto Facultativo, ou seja, cabe às empresas e orgão públicos decidirem se trabalharão ou não.",
                'type_code': "4"
              },
            ],

            // `status` is the HTTP status code from the server response
            status: 200,

            // `statusText` is the HTTP status message from the server response
            statusText: 'OK',

            // `headers` the headers that the server responded with
            // All header names are lower cased
            headers: {},

            // `config` is the config that was provided to `axios` for the request
            config: {},

            // `request` is the request that generated this response
            // It is the last ClientRequest instance in node.js (in redirects)
            // and an XMLHttpRequest instance the browser
            request: {}
          });
        },
      });

      calendarioService.getHolidays = function() {
        return Promise.resolve([
          {
            "date": "01/01/2018",
            "name": "Ano Novo",
            "link": "http://www.calendario.com.br/feriados-nacionais/ano-novo.php",
            "type": "Feriado Nacional",
            "description": "O Ano-Novo ou Réveillon é um evento que acontece quando uma cultura celebra o fim de um ano e o começo do próximo. A celebração do evento é também chamada Réveillon, termo oriundo do verbo francês réveiller, que em português significa DESPERTAR",
            "type_code": "1"
          },
          {
            "date": "12/02/2018",
            "name": "Carnaval",
            "link": "http://www.calendario.com.br/feriados-nacionais/carnaval.php",
            "type": "Facultativo",
            "description": "Ponto Facultativo, ou seja, cabe às empresas e orgão públicos decidirem se trabalharão ou não.",
            "type_code": "4"
          },
        ])
      }
    });

    it('deve resolver e retornar true se algum feriado tiver a data passada de parâmetro', (done) => {
      calendarioService.isHoliday('2018-01-01', '1232')
        .then((result) => {
          expect(result.result).toBeTruthy();
          expect(typeof result.details).toBe('object');
          done();
        });
    });

    it('deve resolver e retornar false se algum feriado tiver a data passada de parâmetro', (done) => {
      calendarioService.isHoliday('2018-01-02', '1232')
        .then((result) => {
          expect(result.result).toBeFalsy();
          expect(result.details).toBeUndefined();
          done();
        });
    });
  });
});
