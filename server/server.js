//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

//config
const app = express();
const port = 3000;
const debug = require('debug')('server');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    debug(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', (err) => {
    debug(`MongoDB connection error: ${err}`);
})

app.get('/', (req, res) => {
    res.json({message:'Welcome to Auth API'});
});

//routes
app.get('/api', (req,res) => {
    res.json({
        endpoints: {
            createUser: 'POST /api/users/register',
            loginUser: 'POST /api/users/login',
        },
    });
});

//register
app.post('/api/users', async (req, res) => {
    const {username,password} = req.query;
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
    const { username, password } = req.query;
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


app.listen(port, () => {
    console.log(`server running: http://localhost:${port}`);
});