var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/image", async (req, res) => {
  try {
    uploadSingleImage(req, res, function (err) {
      const { entiyName, entiy } = req.body;

      if (!entiyName) {
        return res.send({ error: `You must provide line name.` });
      }

      if (err) {
        return res.status(400).send({ error: err.message });
      }

      if (req.file == undefined) {
        return res.send({ error: `You must select a file.` });
      }

      const file = req.file;

      let queryRow;
      if (entiy === "line") {
        queryRow = `UPDATE metro_line
          SET line_picture = '${file.filename}'
          WHERE line_name = '${entiyName}'`;
      } else {
        queryRow = `UPDATE stations
          SET station_picture = '${file.filename}'
          WHERE station_name = '${entiyName}'`;
      }

      sql.query(queryRow, (err, data) => {
        if (err) {
          sendErr(res, err);
        }

        res.status(200).send({
          filename: file.filename,
          mimetype: file.mimetype,
          originalname: file.originalname,
          size: file.size,
          fieldname: file.fieldname,
        });
      });
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

module.exports = router;
