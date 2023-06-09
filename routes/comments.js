const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");

const multipartMiddleware = multipart();
const sql = require("../models/db.js");

router.get("/", (req, res) => {
  sql.query(
    `SELECT comments.id_comments, comments.comment, comments.date_at, users.name FROM comments INNER JOIN users ON comments.user_id = users.id`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.post("/", multipartMiddleware, (req, res) => {
  const { userId, comment } = req.body;

  sql.query(
    `INSERT INTO comments (user_id, comment) VALUES (${userId}, '${comment}')`,
    [userId, comment],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Comment added successfully!" });
    }
  );
});

router.delete("/:id", (req, res) => {
  sql.query(
    `DELETE FROM comments WHERE id_comments=?`,
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Comment deleted successfully!" });
    }
  );
});

module.exports = router;
