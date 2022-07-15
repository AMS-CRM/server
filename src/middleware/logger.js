/*
*
* @Desc Middleware to log every incoming request
*
*
**/
const Logs = require("../models/logs.model.js");
const mongoose = require("mongoose");

const logger = async (req, res, next) => {

    // Get the request data 
    const { method, originalUrl, ip, body, requestID, token, user } = req;
    const headers = JSON.stringify(req.headers);
    const client = headers["user-agent"];


    // Logs the data
    if ( requestID ) {
        
        // Get the exisiting log
        const { success, statusCode, code } = res;

        const logData = {
            success: success,
            status: statusCode ||  null,
            token: token || null,
            code: code || 0,
            user: (req.user) ? mongoose.Types.ObjectId(req.user.id) : null, // Case user just trying to login
            payload: res.payload || null,
            error: res.errors || null
        }


        const Logged = await Logs.update({
            _id: mongoose.Types.ObjectId(requestID)
        }, logData);

    } else {
        
        // Extend the end request
       // Add the logger at the end of the request
        const endFn = res.end;
        res.end = function(...args) {
            logger(req, res, next);
            return endFn.call(this, ...args)
        }

        // Compose the log data
        const log = new Logs(
                {
                    method: method,
                    path: originalUrl,
                    ip: ip,
                    code: "00001",
                    requestData: body,
                    client: client
                }
        )

        // Create a new log 
        const Logged = await log.save(log);
        req.requestID = Logged._id;

    }

     // Add the request id 
     next();
}

module.exports = logger;