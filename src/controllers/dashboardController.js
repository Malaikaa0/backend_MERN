const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const { orgId } = req.params;

    const totalProjects = await Project.countDocuments({ organization: orgId, isArchived: false });

    const projects = await Project.find({ organization: orgId }).select("_id");
    const projectIds = projects.map((p) => p._id);

    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, column: "Completed" });
    const pendingTasks = await Task.countDocuments({ project: { $in: projectIds }, column: { $ne: "Completed" } });
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      column: { $ne: "Completed" },
    });

    res.status(200).json({ totalProjects, completedTasks, pendingTasks, overdueTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ members: userId, isArchived: false }).select("_id");
    const projectIds = projects.map((p) => p._id);

    const totalProjects = projectIds.length;
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, column: "Completed" });
    const pendingTasks = await Task.countDocuments({ project: { $in: projectIds }, column: { $ne: "Completed" } });
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      column: { $ne: "Completed" },
    });

    res.status(200).json({ totalProjects, completedTasks, pendingTasks, overdueTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats, getMyStats };