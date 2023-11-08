const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topics: [{
        type: String,
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Represents the duration in minutes
        required: true,
    },
    expirationTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'],
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = mongoose.model('posts', PostSchema) // exporting and mapping the posts schema