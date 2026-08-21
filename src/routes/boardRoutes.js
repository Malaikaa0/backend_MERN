const express = require("express");
const { createBoard, getBoardByProject } = require("../controllers/boardController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/", createBoard);
router.get("/project/:projectId", getBoardByProject);

module.exports = router;