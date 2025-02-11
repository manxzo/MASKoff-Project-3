const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config(); // Load secret key from .env file

const AES_SECRET_KEY = process.env.AES_SECRET_KEY || '115NEQrOTRcxxp927aecSbZXUERoFyvYz71GrxabigODAJ+eUp1lnIw2tG2YkdLk'; // 32 bytes

// Function to encrypt a message
const encryptMessage = (text) => {
  const iv = crypto.randomBytes(16); // Generate a random IV for each message
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY, 'utf8'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'), // Store IV as a hex string
    encryptedData: encrypted
  };
};

// Function to decrypt a message
const decryptMessage = (encryptedText, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET_KEY, 'utf8'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Define the message schema inside the chat log
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encryptedMessage: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Define the chat log schema
const chatLogSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  messages: [messageSchema] // Array of message objects
});

// Method to add a new message (encrypts before storing)
chatLogSchema.methods.addMessage = async function (sender, recipient, text) {
  const { iv, encryptedData } = encryptMessage(text);
  this.messages.push({
    sender,
    recipient,
    encryptedMessage: encryptedData,
    iv
  });
  await this.save();
};

// Method to decrypt all messages in the chat log
chatLogSchema.methods.getDecryptedMessages = function () {
  return this.messages.map(msg => ({
    sender: msg.sender,
    recipient: msg.recipient,
    message: decryptMessage(msg.encryptedMessage, msg.iv),
    timestamp: msg.timestamp
  }));
};

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

module.exports = ChatLog;
