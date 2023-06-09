const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("../models/db.js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/auth");

const getMultiple = async (res) => {
  sql.query(`SELECT id, name, password FROM users`, (err, data) => {
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
  });
};

const createUser = async (user, res) => {
  sql.query(
    `INSERT INTO users (name, password) values ('${user.name}', '${user.password}')`,
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
      });
    }
  );
};

const loginUser = async (user, res) => {
  sql.query(`SELECT * FROM users WHERE name = '${user.name}'`, (err, data) => {
    if (err) {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
      return;
    }

    if (data.length) {
      if (user.password === undefined) {
        res.status(400).json({
          status: "failed",
          message: "Password is not defined",
        });
      }
      const passwordIsValid = bcrypt.compareSync(
        user.password,
        data[0].password
      );

      if (passwordIsValid) {
        const userFromDB = {
          id: data[0].id,
          name: data[0].name,
          role: data[0].role,
        };
        const accessToken = generateAccessToken(userFromDB);
        const refreshToken = generateRefreshToken(userFromDB);

        sql.query(
          `INSERT INTO refreshtokens (refreshtoken) values ('${refreshToken}')`,
          (err, data) => {
            if (err) {
              res.status(400).json({
                status: "failed",
                message: "Error while writing refreshtoken to DB",
              });
              return;
            }

            res
              .status(200)
              .json({ accessToken: accessToken, refreshToken: refreshToken });
          }
        );
      } else {
        res.status(400).json({
          status: "failed",
          message: "Invalid password",
        });
      }
    }
  });
};

const getRefreshToken = async (refreshtoken, res) => {
  sql.query(
    `SELECT * FROM refreshtokens WHERE refreshtoken = '${refreshtoken}'`,
    (err, data) => {
      if (err) {
        res.status(403).json({
          status: "failed",
          message: err.message,
        });
        return;
      }

      jwt.verify(
        data[0].refreshtoken,
        process.env.REFRESH_TOKEN,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken({ name: user.name });
          res.status(200).json({ accessToken: accessToken });
        }
      );
    }
  );
};

const deleteRefreshToken = async (refreshtoken, res) => {
  sql.query(
    `DELETE FROM refreshtokens WHERE refreshtoken = '${refreshtoken}'`,
    (err, data) => {
      if (err) {
        res.status(403).json({
          status: "failed",
          message: err.message,
        });
        return;
      }

      res.status(204).json({ status: "failed" });
    }
  );
};

module.exports = {
  getMultiple,
  createUser,
  loginUser,
  getRefreshToken,
  deleteRefreshToken,
};
