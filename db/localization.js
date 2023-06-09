const sql = require("../models/db.js");

const sendErr = (res, err) => {
  res.status(400).json({
    status: "failed",
    message: err.message,
  });
  return;
};
const getAll = async (res) => {
  sql.query(
    `SELECT * FROM translations;
    `,
    (err, data) => {
      if (err) {
        sendErr(res, err);
      }

      const result = {
        en: {},
        ru: {},
        bel: {},
      };

      data.map((row) => {
        const category = row.category;
        const isCategoryExist = result.en.hasOwnProperty(category);

        if (!isCategoryExist) {
          result.en[category] = {};
          result.ru[category] = {};
          result.bel[category] = {};

          addCategory(result, row);
        }
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    }
  );
};

const addCategory = (result, row) => {
  result.en[row.category] = row.en;
  result.ru[row.category] = row.ru;
  result.bel[row.category] = row.bel;
};

const updateLocalisation = async (locale, value, category, res) => {
  const queryRow = `UPDATE translations
  SET ${locale} = '${value}'
  WHERE category = '${category}'`;

  sql.query(queryRow, (err, data) => {
    if (err) {
      sendErr(res, err);
    }
    res.status(200).json({
      status: "success",
    });
  });
};

module.exports = {
  getAll,
  updateLocalisation,
};
