const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const { getAll, updateLocalisation } = require("../db/localization.js");

const multipartMiddleware = multipart();

router.get("/all", async (req, res) => {
  try {
    await getAll(res);
  } catch (err) {
    console.log("err", err);
  }
});

router.put("/", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    const { locale, value, category } = req.body;

    await updateLocalisation(locale, value, category, res);
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = router;
