const express = require("express")
const connectDB = require("./src/config/db");
const dotenv = require("dotenv").config()
const loader = require("./src/loader/loader");
const path  = require("path");
const colors = require("colors");
const {errorHandler} = require("./src/middleware/errorHandler")
const {responseHandler} = require("./src/middleware/responseHandler")
const logger = require("./src/middleware/logger.js")
const cors = require('cors');
const app = express();

// Express app middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(logger)
app.response.sendStatus = responseHandler

// Build custom express properties using funcion
const customePropertyGenerator = (propNm, varNm, app) => {
	app.response[propNm] = function(propVal) {
		this[varNm] = propVal;
		return this
	}
} 
(async() => {
	await customePropertyGenerator("setCode", "code", app)
	await customePropertyGenerator("setPayload", "payload", app)
})()

// Connec to the mongo db database
connectDB();

const appLoader = loader(app, path.join(__dirname, "src/api"));
app.use(errorHandler)


appLoader.listen(process.env.PORT, () => console.log(`Running server at port ${process.env.PORT}`))