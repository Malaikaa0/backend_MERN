const express = require("express");
const { getDashboardStats, getMyStats } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/stats", getMyStats);
router.get("/:orgId", getDashboardStats);

module.exports = router;