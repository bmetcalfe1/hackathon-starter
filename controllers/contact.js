const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'bmetcalfe1',
    pass: 'notmanHouse1'
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  //console.log("myreq", req);
  //console.log("myres", res);
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    //console.log("whooo the error");
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'adrien.peynichou@gmail.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form | Hackathon Starter',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    //console.log("mytransporter", transporter);
    //console.log("mymailoptions", mailOptions);
    if (err) {
      //console.log("whyyy the error");
      //console.log("theerror", err);
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
