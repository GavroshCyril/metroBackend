const express = require("express");
const router = express.Router();

const multipart = require("connect-multiparty");
const { getAll } = require("../db/lines.js");

const multipartMiddleware = multipart();

router.get("/all", async (req, res) => {
    try {
      await getAll(res);
    } catch (err) {
      console.log("err", err);
    }
  });

module.exports = router;