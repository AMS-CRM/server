const asyncHandler = require("express-async-handler");

// Controller to get all the list of speaking modules
const speakingQuestionListPublic = asyncHandler(async (req, res) => {
  try {
    if (true) {
      res
        .status(400)
        .setCode(23432)
        .setPayload({ msg: "Error! Something is not right" });
      throw new Error("Validation error");
    }

    return res
      .status(200)
      .setCode(544)
      .setPayload({ msg: "List here! Success" })
      .respond();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  speakingQuestionListPublic,
};
