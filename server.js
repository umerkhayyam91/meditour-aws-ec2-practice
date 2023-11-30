const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const dbConnect = require("./database/index");
const ErrorHandler = require("./middlewares/errorHandler");
const { PORT } = require("./config/index");
app.use(express.json({ limit: "50mb" }));

const labRouter = require("./routes/laboratory");
const pharmRouter = require("./routes/pharmacy");
const docRouter = require("./routes/doctor");

app.use(labRouter);
app.use(pharmRouter);
app.use(docRouter);

dbConnect();
app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log("server running");
});