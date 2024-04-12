'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

const gmailEmail = 'cromosApp@gmail.com';
const gmailPassword = 'chromos-cc861';
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

const APP_NAME = 'Cromos APP';

exports.sendEmail = functions.firestore.document(`contact-forms/{uid}`)
    .onCreate((snap, context) => {
        const newValue = snap.data();
        const name = newValue.name;
        const email = newValue.email;
        const phone = newValue.phone;
        const message = newValue.message;
        return sendEmail(name, email, phone, message);
    });

function sendEmail(name, email, phone, message) {
    const mailOptions = {
        from: `${APP_NAME} <noreply@cromos.com>`,
        to: email,
    };
    // The user subscribed to the newsletter.
    mailOptions.subject = `Contact from ${name}`;
    mailOptions.html = `<h3>Name: ${name}</h3>
    <h3>email: ${email}</h3>
    <h3>phone: ${phone}</h3>
    <p><b><i>${message}</i></b></p>`;
    return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New welcome email sent to:', email);
    });
}

exports.sendGroupInvitations = functions.firestore.document(`groups/{uid}`)
    .onCreate((snap, context) => {
        const users = snap.data().users;
        const groupName = snap.data().name;

        users.forEach(user => {
            return groupInvitations(groupName, user.user_email)
        })
    });


function groupInvitations(groupName, email) {
    const mailOptions = {
        from: `${APP_NAME} <noreply@cromos.com>`,
        to: email,
    };
    // The user subscribed to the newsletter.
    mailOptions.subject = `Invitation from ${APP_NAME} for group ${groupName}`;
    mailOptions.html = `<h3>Invitation for group: ${groupName}</h3>
        <p><b><i>Please click on the link below and register to the app:</i></b></p>
        <p><a href="chromos-cc861.firebaseapp.com">chromos-cc861.firebaseapp.com</a></p>`;
    return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('email was send:', email);
    });
}