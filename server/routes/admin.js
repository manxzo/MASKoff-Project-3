const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const Job = require("../models/Job");
// const Post = require("../models/Post");
const isAdmin = require("../middleware/isAdmin");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

// Setup CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Apply CSRF protection to all routes in this router
router.use(csrfProtection);

router.use(cookieParser());

// Login page
router.get("/login", (req, res) => {
  res.render("admin/login", { csrfToken: req.csrfToken() });
});

// Login handler
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (
      !user ||
      user.role !== "admin" ||
      !(await user.isCorrectPassword(password))
    ) {
      return res.redirect("/admin/login");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("adminToken", token, { httpOnly: true });
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.redirect("/admin/login");
  }
});

// Dashboard
router.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort("-createdAt");
    // const jobs = await Job.find({}).sort("-createdAt");
    // const posts = await Post.find({}).sort("-createdAt");

    res.render("admin/dashboard", {
      users,
      jobs: [], // Temporary empty array
      posts: [], // Temporary empty array
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Delete handlers
router.post("/users/:id/delete", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Comment out Job and Post delete handlers
/*
router.post("/jobs/:id/delete", isAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.post("/posts/:id/delete", isAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
*/

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/admin/login");
});

// Get edit user page
router.get("/users/:id/edit", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.redirect("/admin/dashboard");
    }
    res.render("admin/edit-user", {
      user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    res.redirect("/admin/dashboard");
  }
});

// Handle edit user form submission
router.post("/users/:id/edit", isAdmin, async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect("/admin/dashboard");
    }

    // Update username if changed
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.redirect(`/admin/users/${user._id}/edit`);
      }
      user.username = username;
    }

    // Update password if provided
    if (password) {
      user.password = password;
    }

    // Update role
    user.role = isAdmin ? "admin" : "user";

    await user.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.redirect("/admin/dashboard");
  }
});

module.exports = router;
