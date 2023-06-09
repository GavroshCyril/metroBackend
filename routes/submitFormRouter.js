const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Обработка CORS
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.post("/", (req, res) => {
  const formData = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "cooperation.by@mail.ru",
      pass: "HVa75iCkiJScZY8wf24Z",
      //paword 2iRmORmrUa2&
    },
  });

  const mailOptions = {
    from: formData.email,
    to: "cooperation.by@mail.ru",
    subject: "Заявка на посещение выставочной экспозиции",
    html: `
      <div  style="padding: 20px; border: 2px solid black; font-family: Arial; sans-serif; font-size: 18px">
      <h1 style="color: #333; display: flex; justify-content: center;">Информация о посетителе:  </h2>
        <p ><strong>Фамилия, имя, отчество:</strong> <span style="color: #666;">${formData.fullName}</span></p>
        <p><strong>Номер телефона:</strong> <span style="color: #666;">${formData.phoneNumber}</span></p>
        <p><strong>Примечание:</strong> <span style="color: #666;">${formData.note}</span></p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Ошибка при отправке данных");
    } else {
      console.log("Данные отправлены: " + info.response);
      res.status(200).send("Данные успешно отправлены");
    }
  });
});

module.exports = router;
