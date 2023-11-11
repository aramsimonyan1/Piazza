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
        default: 'Live', // two values allowed but the default is Live
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
    }],
    interactions: [{
        userId: {
            type: String,
            required: true,
        },
        userName:{
            type: String,
        },
        interaction: {
            type: String,
            enum: ['like', 'dislike', 'comment'],
            required: true,
        },
        timeLeft: {
            type: Number, // You can adjust the data type based on your requirements
            required: true,
        },
    }],
})

module.exports = mongoose.model('posts', PostSchema) // exporting and mapping the posts schema