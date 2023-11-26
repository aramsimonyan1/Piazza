const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    userId: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    topics: [{
        type: String,
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
        required: true,
        validate: {
            validator: function (v) {
                return ['Politics', 'Health', 'Sport', 'Tech'].includes(v)
            },
            message: 'Invalid topic value',
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    },
    expirTimeInMin: {
        type: Number, // post expiration time in minutes
        required: true
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
    interestScore: {
        type: Number, // This field represents the sum of likes and dislikes
        default: 0
    },
    interactions: [{
        interactionTime: {
            type: Date,
            default: Date.now,
            required: true
        },
        interactionType: {
            type: String,
            enum: ['like', 'dislike', 'comment'],
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        text: {
            type: String
        },
        postExpiresIn: {
            type: String // minutes and seconds casted into String
        }
    }]
})

module.exports = mongoose.model('posts', PostSchema) // exporting and mapping the posts schema