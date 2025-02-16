require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const { generateToken, verifyToken } = require("./components/jwtUtils");
const User = require("./models/User");
const ChatLog = require("./models/ChatLog");
const Introduction = require("./models/Introduction");
const Post = require("./models/Post"); //NEW
const Job = require("./models/Job"); //NEW
const { verify } = require("jsonwebtoken");
const adminRoutes = require("./routes/admin");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(morgan("combined"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("/admin", adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MaskOFF" });
});

app.get("/api", (req, res) => {
  res.json({
    endpoints: {
      register: "POST /api/newuser",
      login: "POST /api/users/login",
      getUser: "GET /api/user/:userID",
      listUsers: "GET /api/users",
      friendRequest: "POST /api/friends/request",
      friendRequests: "GET /api/friends/requests",
      deleteFriendRequest: "DELETE /api/friends/request", //NEW
      acceptFriend: "POST /api/friends/accept",
      friends: "GET /api/friends",
      createChat: "POST /api/chat/create",
      listChats: "GET /api/chats",
      findChats: "GET /api/chat/:userId", //NEW
      sendMessage: "POST /api/chat/send",
      getMessages: "GET /api/chat/messages/:chatId",
      deleteMessage: "DELETE /api/chat/message/:chatId/:messageId",
      deleteChat: "DELETE /api/chat/:chatId",
      createPost: "POST /api/posts", //NEW
      getPosts: "GET /api/posts", //NEW
      getPost: "GET /api/posts/:postId", //NEW
      updatePost: "PUT /api/posts/:postId", //NEW
      deletePost: "DELETE /api/posts/:postId", //NEW
      addComment: "POST /api/posts/:postId/comments", //NEW
      createJob: "POST /api/jobs", //NEW
      getJobs: "GET /api/jobs", //NEW
      updateJob: "PUT /api/jobs/:jobId", //NEW
      deleteJob: "DELETE /api/jobs/:jobId", //NEW
      postIntroduction: "POST /api/introduction",
      getIntroductions: "GET /api/introductions",
    },
  });
});

// Register a new user
app.post("/api/newuser", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Username and Password (min 6 chars) required" });
  }
  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }
    // Create and save user
    const newUser = new User({ username, password });
    await newUser.save();
    // Generate JWT
    const token = generateToken(newUser);
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login an existing user
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get your own user data
app.get("/api/user/:userID", verifyToken, async (req, res) => {
  const { userID } = req.params;
  if (req.user.id !== userID) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const user = await User.findById(userID).select(
      "username friends friendRequests"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// List all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username").lean();
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Send a friend request
app.post("/api/friends/request", verifyToken, async (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId)
    return res.status(400).json({ error: "Target user ID required" });
  try {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser)
      return res.status(404).json({ error: "Target user not found" });
    // Prevent duplicate requests or if already friends
    if (
      targetUser.friendRequests.includes(req.user.id) ||
      targetUser.friends.includes(req.user.id)
    ) {
      return res.status(400).json({
        error: "Friend request already sent or you are already friends",
      });
    }
    targetUser.friendRequests.push(req.user.id);
    await targetUser.save();
    return res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Error sending friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Retrieve incoming friend requests
app.get("/api/friends/requests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friendRequests",
      "username"
    );
    return res.status(200).json({ friendRequests: user.friendRequests });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Accept a friend request
app.post("/api/friends/accept", verifyToken, async (req, res) => {
  const { requesterId } = req.body;
  if (!requesterId)
    return res.status(400).json({ error: "Requester ID required" });
  try {
    const user = await User.findById(req.user.id);
    if (!user.friendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ error: "No friend request from this user" });
    }
    // Add each other as friends
    user.friends.push(requesterId);
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );
    await user.save();

    const requester = await User.findById(requesterId);
    requester.friends.push(req.user.id);
    await requester.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//NEW: ! Delete (decline) a friend request -> remove pending friend req from another user
app.delete("/api/friends/request", verifyToken, async (req, res) => {
  const { requesterId } = req.body;
  if (!requesterId)
    return res.status(400).json({ error: "Requester ID required" });
  try {
    const user = await User.findById(requesterId);
    if (!user)
      return res.status(404).json({ error: "Target user ID required" });
    if (!user.friendRequests.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "No friend request from this user" });
    }
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );
    await user.save();
    return res
      .status(200)
      .json({ message: "Friend request declined successfully" });
  } catch (err) {
    console.error("Error deleting friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get friend list for the logged in user
app.get("/api/friends", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username"
    );
    return res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.error("Error fetching friends:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Create or retrieve a chat between the authenticated user and another participant
app.post("/api/chat/create", verifyToken, async (req, res) => {
  const { participantId } = req.body;
  if (!participantId)
    return res.status(400).json({ error: "Participant ID required" });
  const user1 = req.user.id;
  const user2 = participantId;
  try {
    // Check if chat already exists
    let chatLog = await ChatLog.findOne({
      participants: { $all: [user1, user2] },
    });
    if (!chatLog) {
      chatLog = new ChatLog({ participants: [user1, user2], messages: [] });
      await chatLog.save();
    }
    return res.status(200).json({
      chatId: chatLog._id,
      message: "Chat created or retrieved successfully",
    });
  } catch (err) {
    console.error("Error creating chat:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all chats for the logged in user
app.get("/api/chats", verifyToken, async (req, res) => {
  try {
    const chats = await ChatLog.find({ participants: req.user.id }).lean();
    return res.status(200).json({ chats });
  } catch (err) {
    console.error("Error fetching chats:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//NEW: ! Find chats for a specific user (findChats) -> can use in cases where you want to display a list of all convos user is involved. more efficient than fetching all chats then filtering on client side. -> maintain performance and scalability when database grows
app.get("/api/chat/:userId", verifyToken, async (req, res) => {
  const { userID } = req.params;
  try {
    const chats = await ChatLog.find({ participants: userID }).lean();
    return res.status(200).json({ chats });
  } catch (err) {
    console.error("Error fetching chats for user: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Send a message in a chat (only if the user is a participant)
app.post("/api/chat/send", verifyToken, async (req, res) => {
  const { chatId, message } = req.body;
  if (!chatId || !message) {
    return res.status(400).json({ error: "Chat ID and message are required" });
  }
  try {
    const chatLog = await ChatLog.findById(chatId);
    if (!chatLog) return res.status(404).json({ error: "Chat not found" });
    // Verify the sender is a participant
    if (!chatLog.participants.some((id) => id.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized for this chat" });
    }
    const recipient = chatLog.participants.filter(
      (id) => id.toString() !== req.user.id
    );
    await chatLog.addMessage(req.user.id, recipient, message);
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: err });
  }
});

// Retrieve decrypted messages from a chat (only if the user is a participant)
app.get("/api/chat/messages/:chatId", verifyToken, async (req, res) => {
  try {
    const chatLog = await ChatLog.findById(req.params.chatId);
    if (!chatLog) return res.status(404).json({ error: "Chat not found" });
    if (!chatLog.participants.some((id) => id.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized for this chat" });
    }
    const messages = chatLog.getDecryptedMessages();
    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Delete a message (only allowed by the sender)
app.delete(
  "/api/chat/message/:chatId/:messageId",
  verifyToken,
  async (req, res) => {
    const { chatId, messageId } = req.params;
    try {
      const updatedChat = await ChatLog.findOneAndUpdate(
        {
          _id: chatId,
          "messages._id": messageId,
          "messages.sender": req.user.id,
        },
        {
          $pull: { messages: { _id: messageId } },
        },
        { new: true }
      );

      if (!updatedChat) {
        return res.status(404).json({
          error: "Chat or message not found, or you are not authorized.",
        });
      }

      return res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
      console.error("Error deleting message with $pull:", err);
      return res
        .status(500)
        .json({ error: err.message || "Server error while deleting message" });
    }
  }
);

// Delete an entire chat (only if the user is a participant)
app.delete("/api/chat/:chatId", verifyToken, async (req, res) => {
  try {
    const chatLog = await ChatLog.findById(req.params.chatId);
    if (!chatLog) return res.status(404).json({ error: "Chat not found" });
    if (!chatLog.participants.some((id) => id.toString() === req.user.id)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this chat" });
    }
    await ChatLog.findByIdAndDelete(req.params.chatId);
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Post an anonymous introduction
app.post("/api/introduction", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });
  try {
    const newIntro = new Introduction({
      user: req.user.id,
      content,
    });
    await newIntro.save();
    return res
      .status(201)
      .json({ message: "Introduction posted successfully" });
  } catch (err) {
    console.error("Error posting introduction:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all introductions
app.get("/api/introductions", async (req, res) => {
  try {
    const intros = await Introduction.find().sort({ createdAt: -1 }).lean();
    const anonymousIntros = intros.map((intro) => ({
      id: intro._id,
      content: intro.content,
      createdAt: intro.createdAt,
    }));
    return res.status(200).json({ introductions: anonymousIntros });
  } catch (err) {
    console.error("Error fetching introductions:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//!* NEW ENDPOINTS *!//

// Create a new post
app.post("/api/posts", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content required" });
  try {
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      comments: [],
    });
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all posts
app.get("api/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username").lean();
    return res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get a single post by ID
app.get("/api/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "username")
      .lean();
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.status(200).json({ post });
  } catch (err) {
    console.error("Error fetching post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Update a post
app.put("/api/posts/:postId", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Post updated successfully", post });
    }
  } catch (err) {
    console.error("Error updating post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Delete a post
app.delete("/api/posts/:postId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }
    await Post.findById(req.params.postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Add comment to a post
app.post("/api/posts/:postId/comments", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content)
    return res.status(400).json({ error: "Comment content required" });
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post no found" });
    const comment = {
      content,
      author: req.user.id,
      timestamp: new Date(),
    };
    post.comments.push(comment);
    await post.save();
    return res
      .status(201)
      .json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error("Error adding comment: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Create new JOB post
app.post("/api/jobs", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: "Title and description required" });
  try {
    const newJob = new Job({
      title,
      description,
      employer: req.user.id,
      applicants: [],
    });
    await newJob.save();
    return res
      .status(201)
      .json({ message: "Job post created successfully", job: newJob });
  } catch (err) {
    console.error("Error creating job post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all JOB posts
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "username").lean();
    return res.status(200).json({ jobs });
  } catch (err) {
    console.error("Error fetching job posts: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get a single JOB post by ID
app.get("/api/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("employer", "username")
      .lean();
    if (!job) return res.status(404).json({ error: "Job post not found" });
    return res.status(200).json({ job });
  } catch (err) {
    console.error("Error fetching job post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Update a JOB post
app.put("/api/jobs/:jobId", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job post not found" });
    if (job.employer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this job post" });
    }
    job.title = title || job.title;
    job.description = description || job.description;
    await job.save();
    return res
      .status(200)
      .json({ message: "Job post updated successfully", job });
  } catch (err) {
    console.error("Error updating job post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Delete a JOB post
app.delete("/api/jobs/:jobId", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job post not found" });
    if (job.employer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this job post" });
    }
    await Job.findByIdAndDelete(req.params.jobId);
    return res.status(200).json({ message: "Job post deleted successfully" });
  } catch (err) {
    console.error("Error deleting job post: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Add this with your other routes
app.patch("/api/users/admin/role", async (req, res) => {
  try {
    const { username, role } = req.body;
    if (role !== "admin") {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
