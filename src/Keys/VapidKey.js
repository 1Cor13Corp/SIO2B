import {config} from 'dotenv'

config()

// vapidConfig.js
// const webPush = require('web-push');

// const vapidKeys = webPush.generateVAPIDKeys();

// console.log('VAPID Public Key:', vapidKeys.publicKey);
// console.log('VAPID Private Key:', vapidKeys.privateKey);

module.exports = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};