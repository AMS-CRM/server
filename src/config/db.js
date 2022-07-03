const mongoose = require("mongoose");

const connectDB = () => {
        try {
            const connect = mongoose.connect(process.env.mongoURI);
            console.log("Connected to the mongoose server".green.underline)

        } catch (error) {
            console.error("Cannot connect to mongodb database".red.underline)
        }
}

module.exports = connectDB;