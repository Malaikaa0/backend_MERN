const Organization = require("../models/Organization");

// Checks the requesting user's role WITHIN a specific organization.
// Usage: authorize("org_admin") or authorize("org_admin", "project_manager")
// Expects req.params.orgId OR req.params.id (organization id) to be present.
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const orgId = req.params.orgId || req.params.id;

      if (!orgId) {
        return res.status(400).json({ message: "Organization id missing from request" });
      }

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const membership = organization.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!membership) {
        return res.status(403).json({ message: "You are not a member of this organization" });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ message: "You do not have permission to perform this action" });
      }

      req.orgMembership = membership;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
};

module.exports = { authorize };