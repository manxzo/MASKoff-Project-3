//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const ChatLog = require('./models/ChatLog')
const cors = require("cors");
const { generateToken } = require('./components/jwtUtils');
const { verifyToken } = require('./components/jwtUtils');
//config
const app = express();
const port = 3000;
const debug = require('debug')('server');

//middleware
app.use(express.json());
app.use(cors());
//MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    debug(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', (err) => {
    debug(`MongoDB connection error: ${err}`);
});

//routes
app.get('/', (req, res) => {
    res.json({message:'Welcome to Auth API'});
});

app.get('/api', (req,res) => {
    res.json({
        endpoints: {
            createUser: 'POST /api/newuser',
            loginUser: 'POST /api/login',
            fetchUserData: 'GET /api/user/:userID',
            fetchUsers: 'GET /api/users'
        },
    });
});


app.post('/api/newuser', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password required' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Create and save user
        const newUser = new User({ username, password });
        await newUser.save();

        // Generate JWT
        const token = generateToken(newUser);
        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { username: newUser.username },
        });
    } catch (err) {
        debug('Error registering user: ', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    try {
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check password
        const isPasswordCorrect = await user.isCorrectPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken(user);
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { username: user.username ,_id:user._id},
        });
    } catch (err) {
        debug('Error logging in user: ', err);
        return res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/user/:userID', verifyToken, async (req, res) => {
    const { userID } = req.params;

    try {
        // Ensure the logged-in user is requesting their own data
        if (req.user.id !== userID) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user: { username: user.username } });
    } catch (err) {
        debug('Error fetching user data: ', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
//Get all users
app.get('/api/users',async(req,res)=>{
    try{
        const users = await User.find({},"username").lean();
        const usernamesAndIds = users.map((user)=>({username:user.username,_id:user._id}));
        return res.status(200).json({message:"Retrived all users!",users:usernamesAndIds})
    }
    catch (err) {
    debug('Error fetching user data: ', err);
    return res.status(500).json({ error: 'Server error' });
}
})



//Create new Chat
app.post('/api/chat/create', async (req, res) => {
    const { user1, user2 } = req.body; // Two users starting a chat
  
    try {
      let chatLog = await ChatLog.findOne({
        participants: { $all: [user1, user2] }
      });
  
      if (!chatLog) {
        chatLog = new ChatLog({ participants: [user1, user2], messages: [] });
        await chatLog.save();
      }
  
      res.status(200).json({ chatId: chatLog._id, message: "Chat created successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
//Get all of users chats
  app.get('/api/chat/:userId',async(req,res)=>{
    const userId = req.params;
    try {
        const chats = await ChatLog.find({ participants: userId }).lean(); 
        return res.status(200).json({message:"Fetched User Chats",chats:chats});
      } catch (err) {
        return res.status(500).json({ error: 'Server error' });
      }
  })
  /**
   * ✉️ Send a Message (Encrypts & Stores Message)
   */
  app.post('/chat/send', async (req, res) => {
    const { sender, recipient, message } = req.body;
  
    try {
      let chatLog = await ChatLog.findOne({
        participants: { $all: [sender, recipient] }
      });
  
      if (!chatLog) {
        return res.status(404).json({ error: "Chat log not found. Create one first." });
      }
  
      await chatLog.addMessage(sender, recipient, message);
      res.status(200).json({ message: "Message sent successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * Retrieve Messages (Decrypts Messages)
   */
  app.get('/api/chat/messages/:chatId', async (req, res) => {
    try {
      const chatLog = await ChatLog.findById(req.params.chatId);
      if (!chatLog) return res.status(404).json({ error: "Chat log not found" });
  
      const messages = chatLog.getDecryptedMessages();
      res.status(200).json({messages:messages});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * Delete a Message by ID
   */
  app.delete('/api/chat/message/:chatId/:messageId', async (req, res) => {
    const { chatId, messageId } = req.params;
  
    try {
      const chatLog = await ChatLog.findById(chatId);
      if (!chatLog) return res.status(404).json({ error: "Chat log not found" });
  
      chatLog.messages = chatLog.messages.filter(msg => msg._id.toString() !== messageId);
      await chatLog.save();
  
      res.status(200).json({ message: "Message deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * Delete an Entire Chat Log
   */
  app.delete('/api/chat/:chatId', async (req, res) => {
    try {
      await ChatLog.findByIdAndDelete(req.params.chatId);
      res.status(200).json({ message: "Chat deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  
app.listen(port, () => {
    console.log(`server running: http://localhost:${port}`);
});

/*//register
app.post('/api/newuser', async (req, res) => {
    const {username,password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and Password required'});
    }
    try {
        //check user already exist
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).json({error: 'Username already taken'});
        }
        const newUser = new User ({ username,password});
        await newUser.save();
        return res.status(201).json({message: 'User registered successfully'});
        } catch (err) {
            debug('Error registering user: ', err);
            return res.status(500).json({error: 'Server error'});
        }
    });

//login user
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({error: 'Username and Password are required'});
    }
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        const isPasswordCorrect = await user.isCorrectPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'Invalid credentials'});
        }
        return res.status(200).json({
            message: 'Login successful',
            user: {username: user.username},
        });
    } catch (err) {
        debug('Error logging in user: ', err);
        return res.status(500).json({error: 'Server error'});
    }
});
*/


/*
//fetch user data
app.get('/api/user/:userID', async (req, res) => {
    const {userID} = req.params;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        return res.status(200).json({user: {username: user.username}});
    } catch (err) {
        debug('Error fetching user data: ', err);
        return res.status(500).json({error: 'Server error'});
    }
});
*/