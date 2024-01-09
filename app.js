const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'style')));

app.get('/script.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });
    var mailOptions = {
        from: process.env.EMAIL2,
        to: email, 
        cc: process.env.EMAIL2,
        subject: 'New Contact Enquiry by ' + name,
        html: `
            <p>Thanks for your message!</p>
            <p>You have received a message from someone who wishes to contact you.</p>
            <p>To reach out, you can reply to this email (${email}) or call them at ${phone}.</p>
            <p>The message sent by them is:</p>
            <blockquote>${message}</blockquote>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send("Error submitting the form.");
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).send(`
                <html>
                    <head>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f0f0f0;
                                color: #333;
                                text-align: center;
                                margin: 20px;
                            }
                            h1 {
                                color: #007bff;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Thank you for your response!</h1>
                        <p>Your message has been submitted successfully.</p>
                    </body>
                </html>
            `);
        }
    });
});

app.listen(process.env.PORT, function () {
    console.log("Server is running on port " + process.env.PORT);
});
