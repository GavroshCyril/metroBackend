// подключение пакетов
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const localizationRouter = require("./routes/localization");
const lineRouter = require("./routes/line");
const reviewsRouter = require("./routes/reviews");
const commentsRouter = require("./routes/comments");
const newsRouter = require("./routes/news");
const submitFormRouter = require("./routes/submitFormRouter");
const stationRouter = require("./routes/station");
const statisticsRouter = require("./routes/statistics");
const app = express();
const cors = require("cors");

const whitelist = ["http://localhost:3001", "http://localhost:3002"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/localization", localizationRouter);
app.use("/line", lineRouter);
app.use("/station", stationRouter);
app.use("/comments", commentsRouter);
app.use("/reviews", reviewsRouter);
app.use("/news", newsRouter);
app.use("/submit-form", submitFormRouter);
app.use("/statistics", statisticsRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
