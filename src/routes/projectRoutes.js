const express = require("express");
const {
  createProject,
  getProjectsByOrganization,
  getProjectById,
  updateProject,
  archiveProject,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createProject);
router.get("/organization/:orgId", getProjectsByOrganization);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.patch("/:id/archive", archiveProject);

module.exports = router;