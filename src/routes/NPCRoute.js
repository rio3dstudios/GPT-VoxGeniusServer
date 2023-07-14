const express = require("express");
const {
    processMessage

  } = require("../controllers/NPCController");

const router = express.Router();

router.route("/api/npc").post(processMessage);

   
module.exports = router;