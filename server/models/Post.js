const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// sub-schema for comments
const commentSchema = newSchema({
    content: {type: String, required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {type: Date, default: Date.now}
});

//main post schema
const postSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comments: [commentSchema]
    },
    {timestamps: true}
);


const Post = mongoose.model('Post', postSchema);
module.exports = Post;