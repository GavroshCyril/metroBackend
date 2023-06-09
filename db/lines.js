const sql = require("../models/db.js");

function isLineExists(line, line_id) {
  return line.line_id === line_id;
}

const getAll = async (res) => {
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

      let sorted = [];

      data.map((row) => {
        const foundLine = sorted.find(({ line_id }) => line_id === row.line_id);

        if (foundLine) {
          const station = {
            station_id: row.station_id,
            station_name: row.station_name,
            station_description: row.station_description,
            station_picture: row.station_picture,
          };
          foundLine.stations.push(station);
        } else {
          const line = {
            line_id: row.line_id,
            line_name: row.line_name,
            line_description: row.line_description,
            line_picture: row.line_picture,
            stations: [
              {
                station_id: row.station_id,
                station_name: row.station_name,
                station_description: row.station_description,
                station_picture: row.station_picture,
              },
            ],
          };
          sorted.push(line);
        }
      });

      res.status(200).json({
        status: "success",
        data: sorted,
      });
    }
  );
};

module.exports = {
  getAll,
};
