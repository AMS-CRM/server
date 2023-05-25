// Validation custom function to check if the given amount is corrent number
module.exports = checkNumValue = (numValue) => {
  const number = isNaN(numValue);
  if (number || numValue == "") {
    throw new Error("Incorrect amount type");
  }
  if (parseInt(numValue) <= 0) {
    throw new Error("Incorrect amount");
  }
  return true;
};
