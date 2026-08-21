const express = require("express");
const { register, login, updateProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.patch("/profile", protect, updateProfile);
router.patch("/avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.status(200).json({ message: "Avatar updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.patch("/avatar/remove", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: "" },
      { new: true }
    );
    res.status(200).json({ message: "Avatar removed", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.patch("/change-password", protect, changePassword);

module.exports = router;