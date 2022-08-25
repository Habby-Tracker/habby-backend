require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(from, to, subject, body) {
  sendgrid
    .send({ from, to, subject, text: body })
    .then(() => {
      console.log(`Email sent from ${from} to ${to}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

sendEmail(
  process.env.FROM_EMAIL,
  process.env.TO_EMAIL,
  'Email notification!',
  'This is an email notification!'
);
