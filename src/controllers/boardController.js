const Board = require("../models/Board");

const createBoard = async (req, res) => {
  try {
    const { project, name } = req.body;
    if (!project) return res.status(400).json({ message: "Project is required" });

    const board = await Board.create({ project, name });
    res.status(201).json({ message: "Board created", board });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBoardByProject = async (req, res) => {
  try {
    const board = await Board.findOne({ project: req.params.projectId });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.status(200).json({ board });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBoard, getBoardByProject };