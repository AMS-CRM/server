const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv").config();
const loader = require("./src/loader/loader");
const path = require("path");
const colors = require("colors");
const { errorHandler } = require("./src/middleware/errorHandler");
const { responseHandler } = require("./src/middleware/responseHandler");
const logger = require("./src/middleware/logger.js");
const cors = require("cors");
const app = express();
const { stripeWebhook } = require("./src/controller/webhooks/stripe.js");

// Express app middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.post("/webhooks/stripe", stripeWebhook);

app.use(express.json());
app.use(logger);
app.response.respond = responseHandler;

// Build custom express properties using functions
const customePropertyGenerator = (propNm, varNm, app) => {
  app.response[propNm] = function (propVal) {
    this[varNm] = propVal;
    return this;
  };
};
(async () => {
  await customePropertyGenerator("setCode", "code", app);
  await customePropertyGenerator("setPayload", "payload", app);
})();

// Connec to the mongo db database
connectDB();

const appLoader = loader(app, path.join(__dirname, "src/api"));
app.use(errorHandler);

appLoader.listen(process.env.PORT, () =>
  console.log(`Running server at port ${process.env.PORT}`)
);
