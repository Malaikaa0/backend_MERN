const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, board, project, priority, dueDate } = req.body;
    if (!title || !board || !project) {
      return res.status(400).json({ message: "Title, board, and project are required" });
    }

    const task = await Task.create({
      title, board, project, priority, dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasksByBoard = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId, isArchived: false })
      .populate("assignee", "name email");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const moveTask = async (req, res) => {
  try {
    const { column } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { column }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task moved", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTask, getTasksByBoard, updateTask, moveTask, deleteTask };