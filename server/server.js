//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

//config
const app = express();
const port = 3000;
const log = require('debug');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/', (req, res) => {
    res.json({message:'Welcome to auth API'});
});


app.get('/api', (req,res) => {
    res.json
});

app.post('/api/users', async (req, res) => {
    const {username,password} = req.query;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and Password required'});
    }
    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        const isPasswordCorrect = await user.isCorrectPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'Credentials invalid'});
        }
        return res.json({
            message: 'Authentication successful',
            user: {username: user.username},
        });
    } catch (err) {
        console.error('error authenticating: ', err);
        return res.status(500).json({error: 'server error'});
    }
});

app.listen(port, () => {
    console.log(`server running, http://localhost:${port}`);
});