//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
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
            user: { username: user.username },
        });
    } catch (err) {
        debug('Error logging in user: ', err);
        return res.status(500).json({ error: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`server running: http://localhost:${port}`);
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