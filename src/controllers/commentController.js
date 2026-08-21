const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { text, task } = req.body;
    if (!text || !task) return res.status(400).json({ message: "Text and task are required" });

    const comment = await Comment.create({ text, task, author: req.user._id });
    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("author", "name email")
      .sort({ createdAt: 1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addComment, getCommentsByTask, deleteComment };