const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4, 
  connectionTimeout: 10000, 
  greetingTimeout: 5000, 
  socketTimeout: 10000 
});

module.exports = transporter;
