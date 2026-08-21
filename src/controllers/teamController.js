const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const { name, organization } = req.body;

    if (!name || !organization) {
      return res.status(400).json({ message: "Team name and organization are required" });
    }

    const team = await Team.create({
      name,
      organization,
      members: [req.user._id],
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTeamsByOrganization = async (req, res) => {
  try {
    const teams = await Team.find({ organization: req.params.orgId })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addMemberToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: "Member added", team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTeam, getTeamsByOrganization, addMemberToTeam };