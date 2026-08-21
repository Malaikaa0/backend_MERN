const Organization = require("../models/Organization");

const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    const organization = await Organization.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "org_admin" }],
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      "members.user": req.user._id,
    }).populate("owner", "name email");

    res.status(200).json({ organizations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const User = require("../models/User");
const Notification = require("../models/Notification");

const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const validRoles = ["org_admin", "project_manager", "developer", "viewer"];

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const alreadyMember = organization.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    organization.members.push({ user: userToAdd._id, role });
    await organization.save();

    // Create a notification for the invited user
    try {
      await Notification.create({
        user: userToAdd._id,
        message: `You were added to organization ${organization.name}`,
        type: "member_added",
      });
    } catch (notifErr) {
      // non-fatal
      console.error("Failed to create notification:", notifErr.message || notifErr);
    }

    res.status(200).json({ message: "Member added successfully", organization });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (organization.owner.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove the organization owner" });
    }

    organization.members = organization.members.filter(
      (m) => m.user.toString() !== userId
    );
    await organization.save();

    res.status(200).json({ message: "Member removed successfully", organization });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  inviteMember,
  removeMember,
};