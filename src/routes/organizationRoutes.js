const express = require("express");
const {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  inviteMember,
  removeMember,
} = require("../controllers/organizationController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrganization);
router.get("/", getMyOrganizations);
router.get("/:id", getOrganizationById);
router.post("/:id/members", authorize("org_admin"), inviteMember);
router.delete("/:id/members/:userId", authorize("org_admin"), removeMember);

module.exports = router;