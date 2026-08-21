const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { name, description, organization, dueDate } = req.body;

    if (!name || !organization) {
      return res.status(400).json({ message: "Project name and organization are required" });
    }

    const project = await Project.create({
      name,
      description,
      organization,
      dueDate,
      members: [req.user._id],
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProjectsByOrganization = async (req, res) => {
  try {
    const projects = await Project.find({
      organization: req.params.orgId,
      isArchived: false,
    }).populate("members", "name email");

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("organization");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const archiveProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project archived", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createProject, getProjectsByOrganization, getProjectById, updateProject, archiveProject };