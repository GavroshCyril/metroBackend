const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");

const multipartMiddleware = multipart();
const sql = require("../models/db.js");

router.get("/", (req, res) => {
  sql.query(
    `SELECT rewiews.id_rewiews, rewiews.review, rewiews.rating, rewiews.date_at, users.name FROM rewiews INNER JOIN users ON rewiews.user_id = users.id`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/", (req, res) => {
  sql.query(`SELECT rating FROM rewiews`, function (error, results, fields) {
    if (error) {
      res.send(results);
      return;
    }
  });
});

router.post("/", multipartMiddleware, (req, res) => {
  const { userId, review, rating } = req.body;

  sql.query(
    `INSERT INTO rewiews (user_id, review, rating) VALUES (${userId}, '${review}', '${rating}')`,
    [userId, review, rating],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review added successfully!" });
    }
  );
});

router.delete("/:id", (req, res) => {
  sql.query(
    `DELETE FROM rewiews WHERE id_rewiews=?`,
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review deleted successfully!" });
    }
  );
});

module.exports = router;
