//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


//config
const app = express();
mongoose.connect(process.env.MONGODB_URI)

//home
app.get('/', (req,res) => {
    res.render('')
})
