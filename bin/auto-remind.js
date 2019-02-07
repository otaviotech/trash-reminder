#!/usr/bin/env node


const axios = require('axios');
const moment = require('moment');
const appConfig = require('../config');
const dateUtils = require('../src/utils/date.utils');
const createTrashRemovalService = require('../src/service/trashRemoval.service');

const trashRemovalService = createTrashRemovalService();

const currentDate = moment().format('YYYY-MM-DD');

function send(text) {
  axios.post(appConfig.slack.reminderURL, { text })
    .then(() => {
      console.log(`Mensagem enviada com sucesso. (Mensagem: ${text})`);
      process.exit(0);
    })
    .catch(() => {
      console.error('Erro ao tentar gerar mensagem automática do bot.');
      process.exit(1);
    });
}

async function perform () {
  try {
    const dateIsTrashRemovingDay = await trashRemovalService.isTrashRemovingDay(currentDate);

    if (!dateIsTrashRemovingDay) {
      return Promise.resolve();
    }

    const msg = await trashRemovalService.getReminderMessageForDate(currentDate);

    send(msg);

    return Promise.resolve();
  } catch (error) {
    console.error(error);
    console.error('Erro ao tentar gerar mensagem automática do bot.');
  }
}

perform();
