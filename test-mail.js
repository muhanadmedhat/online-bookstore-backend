require('dotenv').config();
const transporter = require('./config/mailer');
console.log("Testing mailer...");
transporter.verify().then(console.log).catch(console.error);
