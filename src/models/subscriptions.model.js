const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	package: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "packages",
		required: true
	},
	reccuringCycle: {
		type: String,
		enum: ["Monthly"],
		default: "Monthly",
		required: true
	},
	dateStarted: {
		type: Date, 
		default:  Date.now()
	},
	status: {
		type: Boolean,
		default: true,
		required: true
	},
	transactions: [{
		method: {
			type: String,
			enum: ["Freemium", "Razorpay"],
			required: true
		},
		creationTime: {
			type: Date,
			default: Date.now(),
			required: true, 
		},
		amount: {
			type: Number, 
			required: true,
			default: 0
		},
		transctionID: {
			type: String,
			required: false
		}
	}]
});

module.exports = subscriptions = mongoose.model("subscriptions", subscriptionSchema);