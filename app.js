const express = require("express")
const connectDB = require("./src/config/db");
const dotenv = require("dotenv").config()
const loader = require("./src/loader/loader");
const path  = require("path");
const colors = require("colors");
const {errorHandler} = require("./src/middleware/errorHandler")
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
connectDB();

const appLoader = loader(app, path.join(__dirname, "src/api"));
app.use(errorHandler)

appLoader.listen(process.env.PORT, () => console.log(`Running server at port ${process.env.PORT}`))