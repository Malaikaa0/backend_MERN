const express = require("express");
const { createTask, getTasksByBoard, updateTask, moveTask, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const path = require("path");
const router = express.Router();
router.use(protect);

router.post("/", createTask);
router.get("/board/:boardId", getTasksByBoard);
router.patch("/:id", updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);
router.post("/:id/attachments", upload.single("file"), async (req, res) => {
  try {
    const Task = require("../models/Task");
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.attachments.push({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
    await task.save();

    res.status(200).json({ message: "File uploaded", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;