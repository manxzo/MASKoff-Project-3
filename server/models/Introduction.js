const mongoose = require('mongoose');

const introductionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  }
}, { timestamps: true });

const Introduction = mongoose.model('Introduction', introductionSchema);
module.exports = Introduction;
