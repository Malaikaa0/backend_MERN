const express = require("express");
const {
  createTeam,
  getTeamsByOrganization,
  addMemberToTeam,
} = require("../controllers/teamController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", authorize("org_admin"), createTeam);
router.get("/organization/:orgId", getTeamsByOrganization);
router.patch("/:id/members", authorize("org_admin"), addMemberToTeam);

module.exports = router;