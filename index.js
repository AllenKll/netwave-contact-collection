const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');

// these must exist in the environment
if ( !('SENDGRID_SMTP_PASSWORD' in process.env) ||
     !('SENDGRID_SMTP_USERNAME' in process.env) ||
     !('ATTACHMENT_URL' in process.env) )
{
  console.log("Missing SMTP user/pass or attachment URL.")
  console.log("Application refusing to start.")
  return -1;
}

var SMTP_SERVER = process.env.SENDGRID_SMTP_SERVER || "smtp.sendgrid.net";
var SMTP_PORT = process.env.SENDGRID_SMTP_PORT || 25;
var collectionAddress = process.env.COLLECTION_ADDRESS || "ultimatefibertech@gmail.com"
var SMTP_USER = process.env.SENDGRID_SMTP_USERNAME;
var SMTP_PASS = process.env.SENDGRID_SMTP_PASSWORD;
var ATTACHMENT = process.env.ATTACHMENT_URL;

// TODO temp for testing
SMTP_USER = "apikey";
SMTP_PASS = "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";
ATTACHMENT = 'http://kennedystuff.com/images/sooncome.jpg';
collectionAddress =  "allenkll@gmail.com"

var requiredFields = [
		"name",
		"phone",
		"interest",
		"email"
];

function loadFileToString(template) {
    return fs.readFileSync( template ).toString();
}
var htmlTemplate = loadFileToString('requestor.html.tmpl');
var textTemplate = loadFileToString('requestor.text.tmpl');


//*******************************
// EMAIL CONFIGURATION AND SETUP
//*******************************
let smtpConfig = {
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
};

let transporter = nodemailer.createTransport(smtpConfig);

// setup email data
let requesterEmail = {
	from: '"No Reply - Netwave" <noreplya@netwaveervicescom>',
	// to: -- filled in at processing time
  subject: 'The information you requested from Netwave', 
  // text: -- filled from template  
	// html: -- filled from template 
  attachments: [
    {   // use URL as an attachment
        path: ATTACHMENT
    }
  ]
};
let netwaveEmail = {
	from: '"No Reply - Netwave" <noreplya@netwaveervicescom>',
    to: collectionAddress,
    subject: 'A website visitor requested information' 
    // text: -- filled in at processing time
};


//***************************
// SET UP APP AND HANDLERS
//***************************
app.use(bodyParser.json());

app.post('/syllabus', (req, res) => {
  var buffer = "";
  // if a json body was properly parsed
  if ('body' in req && req.body !== null) {
    // check for required fields
  	for (var i=0; i<requiredFields.length; ++i ){
  		if (!(requiredFields[i] in req.body)) {
  			res.status(400);
  			res.send("Missing required parameters");
  			return;
  		}
  	}

  	// send mail to netwave
  	netwaveEmail.text = JSON.stringify(req.body, null, 2);
  	transporter.sendMail(netwaveEmail, (error, info) => {
     	if (error) {
          return console.log(error);
     	}
     	console.log('Message sent: %s', info.messageId);
  	});

  	// send mail to requester
    requesterEmail.to = req.body.email;
    // fill in body templates
    requesterEmail.html = mustache.render(htmlTemplate, req.body);
    requesterEmail.text = mustache.render(textTemplate, req.body);
    transporter.sendMail(requesterEmail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  } else {
    if ('body' in req){
      buffer += "null body\r\n";
    } else {
      buffer += "no body in request\r\n";
    }
    res.status(400);
  }  
  
  res.send(buffer);
})

app.get('*', (req, res) => {
	res.status(404).end();
});

//*************
// START APP
//*************
// verify email connection configuration
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
        app.listen(PORT, () => console.log(`Listening on port ${ PORT }!`));
   }
});

