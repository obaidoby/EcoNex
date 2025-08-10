const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Configure Nodemailer (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'econexai.consulting@gmail.com', // Your Gmail address
    pass: 'vdjr yhbb gvay kieb', // Gmail App Password (not regular password)
  },
});

// Handle form submission
app.post('/submit-form', upload.single('attachment'), (req, res) => {
  const { fullName, email, interest, message } = req.body;
  const attachment = req.file;

  // Email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'econexai.consulting@gmail.com',
    subject: `New Contact Form Submission from ${fullName}`,
    text: `
      Name: ${fullName}
      Email: ${email}
      Interest: ${interest}
      Message: ${message}
    `,
    attachments: attachment
      ? [{ filename: attachment.originalname, path: attachment.path }]
      : [],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error sending message. Please try again later.');
    }
    res.send('Message sent successfully!');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});