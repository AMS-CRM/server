const User = require("../models/user.model");

// Get the current user balance
module.exports = async (user) => {
  // Get the account balance
  const credit = await User.findOne({ _id: user }, { balance: 1 });
  return credit;
};
