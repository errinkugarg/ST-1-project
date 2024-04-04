const express = require('express');   //import expressjs framework  
const mongoose = require('mongoose');
const bodyParser = require('body-parser');   //middleware used to parse the body of incoming HTTP requests
//When you send data to a server throgh POST request, the data is not directly available in the request object of Node.js.it comes in chunks or streams.
const nodemailer = require('nodemailer');  // import  Nodemailer   allows you to send emails easily. 
const User = require('./models/Users');
const cors = require('cors');  // import cors middleware
const app = express();  //instance create exp applic.
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/g24', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

// Define new MongoDB schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: Number },
});

// Route to handle user registration and OTP sending
app.post('/register', async (req, res) => {
  try {
    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create new user
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      verified: false,
      otp: otp,
    });
    // Save user to database
    await user.save();
    // Send OTP via email
    sendOTP(req.body.email, otp);
    res.status(200).send('OTP sent successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.post('/verify-otp', async (req, res) => {
    try {
      const otp = req.body.otp;
      const user = await User.findOne({ otp });
  
      if (user) {
        // Update user verification status
        user.verified = true;
        await user.save();
  
        res.json({ success: true, user: { name: user.email } });
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

// Function to send OTP via email

function sendOTP(email, otp) {  // two parameters
  const transporter = nodemailer.createTransport({  // used to send mail
    service: 'gmail',
    auth: {
      user: 'rinkugarg71511@gmail.com', // Your Gmail email address
      pass: 'ozrf xrfi rcay pwer', // Your Gmail app password
    },
  });

  const mailOptions = {
    from: 'rinkugarg71511@gmail.com',
    to: email,
    subject: 'OTP for registration',
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`localhost ${PORT}`));
