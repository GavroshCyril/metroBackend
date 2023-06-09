const express = require("express");
const router = express.Router();
const path = require("path");

const sql = require("../models/db.js");
const multipart = require("connect-multiparty");
const { sendErr } = require("../helpers/sendErr");

const multipartMiddleware = multipart();

router.get("/", (req, res) => {
  sql.query(`SELECT * from news`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

router.post("/", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const {
      newsTitleDB,
      newsDescriptionDB,

      newsTitleEN,
      newsTitleBY,
      newsTitleRU,

      newsDescriptionEN,
      newsDescriptionBY,
      newsDescriptionRU,
    } = req.body;

    if (!newsTitleDB) {
      return res.status(400).send({ error: `You must provide  news title.` });
    }

    const queryRow = `
          INSERT INTO news (news_title, news_description)
          VALUES ('${newsTitleDB}', '${newsDescriptionDB}');
          `;

    const queryRow2 = `
          INSERT INTO translations (category, en, ru, bel)
          VALUES ('${newsTitleDB}', '${newsTitleEN}', '${newsTitleRU}', '${newsTitleBY}');
          `;

    const queryRow3 = `
          INSERT INTO translations (category, en, ru, bel)
          VALUES ('${newsDescriptionDB}', '${newsDescriptionEN}', '${newsDescriptionRU}', '${newsDescriptionBY}');
          `;

    let error = null;
    sql.query(queryRow, (err, data) => {
      if (err) {
        error = err;
      }
    });

    sql.query(queryRow2, (err, data) => {
      if (err) {
        error = err;
      }
    });

    sql.query(queryRow3, (err, data) => {
      if (err) {
        error = err;
      }
    });

    res.status(200).send({
      newsTitleDB,
      newsDescriptionDB,
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", (req, res) => {
  sql.query(
    `DELETE FROM news WHERE id_news=?`,
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review deleted successfully!" });
    }
  );
});

module.exports = router;
