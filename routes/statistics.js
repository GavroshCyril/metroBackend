const express = require("express");
const router = express.Router();
const sql = require("../models/db.js");

let totalVisitors = 0; // добавляем переменную для хранения общего количества посетителей

router.use((req, res, next) => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  sql.query(
    "INSERT INTO statistics (date_at, visitors) VALUES (?, 1) ON DUPLICATE KEY UPDATE visitors = visitors+1",
    [date],
    function (error, results, fields) {
      if (error) throw error;
      totalVisitors++; // увеличиваем общее количество посетителей
      next();
    }
  );
});

router.get("/", (req, res) => {
  sql.query("SELECT * FROM statistics", function (error, results, fields) {
    const data = results.map((row) => ({
      date: row.date_at,
      visitors: row.visitors,
    }));
    const avgVisitors = totalVisitors / results.length; // вычисляем среднее количество посетителей
    res.send({ data, avgVisitors }); // отправляем ответ с данными и средним количеством посетителей
    if (error) throw error;
  });
});

module.exports = router;
