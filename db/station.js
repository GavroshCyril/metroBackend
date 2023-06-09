const sql = require("../models/db.js");

const uploadImage = async (res) => {
  sql.query(
    `SELECT *
    FROM metro_line M 
    JOIN stations S ON M.line_id = S.line_id;
    `,
    (err, data) => {
      if (err) {
        res.status(400).json({
          status: "failed",
          message: err.message,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: data,
      });
    }
  );
};

module.exports = {
  uploadImage,
};
