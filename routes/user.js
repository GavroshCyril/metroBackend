const express = require("express");
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");

const { getMultiple, createUser, loginUser } = require("../db/users.js");
const { signupValidation } = require("../helpers/validation.js");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");

const router = express.Router();
const multipartMiddleware = multipart();

/* GET users listing. */
router.get("/all", authenticateToken, async (req, res) => {
  try {
    await getMultiple(res);
  } catch (err) {
    console.log("err", err);
  }
});


//sing up
router.post("/", multipartMiddleware, signupValidation, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    if (req.body.password === req.body.confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = {
        name: req.body.userName,
        password: hashedPassword,
      };

      await createUser(user, res);
    } 
  } catch (err) {
    console.log("err", err);
  }
});

// логин
router.post("/login", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const user = {
      name: req.body.name,
      password: req.body.password,
    };

    await loginUser(user, res);
  } catch (err) {
    console.log("err", err);
  }
});

router.post("/token", async (req, res) => {
  const refreshToken = req.body.token;

  await getRefreshToken(refreshToken, res);
});

router.delete("/logout/:refreshToken", async (req, res) => {
  await deleteRefreshToken(req.params.refreshToken, res);
});

module.exports = router;
