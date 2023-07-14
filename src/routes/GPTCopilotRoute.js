const express = require("express");
const {
    processMessage

  } = require("../controllers/GPTCopilotController");

const router = express.Router();

router.route("/api/copilot").post(processMessage);

   
module.exports = router;