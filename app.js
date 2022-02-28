const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const nodemailer = require("nodemailer");

const app = express();


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.json());
 


//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
app.post('/upload', async (req, res) => {
    try {
        if(!req.files){
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field  to retrieve the uploaded file
            let doc = req.files.doc;
            if(req.files.doc.mimetype !="application/pdf"){
                res.send({
                    status: false,
                    message: 'Invalid file format'
                });
            }else {   
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            doc.mv('./uploads/' + doc.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: doc.name,
                    mimetype: doc.mimetype,
                    size: doc.size
                }
            });
        }}
    } catch (err) {
        res.status(500).send(err);
    }
});

//ContactForum

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "teststb079@gmail.com",
      pass: "6Xi9jcUCHSLHywE",
    },
  });

contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
});
  

app.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message; 
    const mail = {
      from: email,
      to: "teststb079@gmail.com",
      subject: "Contact Form Submission",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });