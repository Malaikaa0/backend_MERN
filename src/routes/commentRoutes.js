const express = require("express");
const { addComment, getCommentsByTask, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/", addComment);
router.get("/task/:taskId", getCommentsByTask);
router.delete("/:id", deleteComment);

module.exports = router;