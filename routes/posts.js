const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Post = require('../models/Post')
const verifyToken = require('../verifyToken') // with:  const { text } = require('body-parser')   also unauthorised users could post

// POST (this method creates data/post in MongoDB based on what user gives us)
router.post('/', verifyToken, async(req, res) => {
    const { title, topics, text, expirTimeInMin } = req.body
    
    const currentTime = new Date()
    // Calculate the expiration time based on the current time and expirTimeInMin.
    const expirationTime = new Date(currentTime.getTime() + expirTimeInMin * 60000) // multiply expirTimeInMin by 60000 to convert it to milliseconds before adding it to the current time.

    // Extract user information from the authenticated token which includes the the user's ID (_id) and username (name).
    const { _id, name } = req.user

    // Creating JSON object for the database.
    const postData = new Post ({ 
        user: name,
        userId: _id,
        title: title,
        topics: topics,
        text: text,
        expirTimeInMin: expirTimeInMin,
        expirationTime: expirationTime,
        status: 'Live',
    })

    try {
        // Save the post data to the database.
        const postToSave = await postData.save() 
        res.send(postToSave)                  
    } catch (err) {
        res.send({message:err})
    }
})



// POST like by post's id: Allows authorised users to like a post
router.post('/like/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params

    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }

        // Check if the the user is trying to delete the post created by other user
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        // Calculating the time left for main post to expire to be presented in format that is easy to understand.
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check whether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {   // when condition is true: below message and status 403 Forbidden is sent.
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // Check if the user is trying to like his/her own post
        if (post.userId.toString() === req.user._id.toString()) {
            return res.status(403).send({message: 'Users cannot like their own posts'})
        }

        post.likes += 1           // "like" operation on the post.
        post.interestScore += 1   // also increase the post interest score used to find the post with the highest interest

        // Record user interaction data with a post
        post.interactions.push({
            interactionTime: currentTime,
            interactionType: 'like',
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            postExpiresIn: friendlyFormat // Time left for the main post to expire (calculated above) presented in format that is easy to understand
        })

        await post.save()
        res.send({message: req.user.name + ' liked a post by ' + post.user + '.'}) // The response message indicates who liked whose post.
    } catch (err) {
        console.error(err) // Log the error to the console for debugging
        res.status(500).send({message: 'Internal Server Error'})
    }
})



// POST dislike by post's id: Allows authorised users to dislike a post
router.post('/dislike/:postId', verifyToken, async(req, res) => {
    const { postId } = req.params

    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }
        
        // Fetch the post ID from the database and check if the post exists
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        // Calculating the time left for main post to expire to be presented in format that is easy to understand.
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {   // When condition is true: below message and status 403 Forbidden is sent.
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // Check if the user is trying to dislike his/her own post
        if (post.userId.toString() === req.user._id.toString()) {
            return res.status(403).send({message: 'Users cannot dislike their own posts'})
        }

        post.dislikes += 1        // "dislike" operation on the post.
        post.interestScore += 1   // also increase the post interest score used to find the post with highest interest

        // Record user interaction data with a post
        const interactionData = {
            interactionTime: currentTime,
            interactionType: 'dislike',
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            postExpiresIn: friendlyFormat // Time left for the main post to expire (calculated above) presented in format that is easy to understand
        }
        post.interactions.push(interactionData)
        await post.save()
        res.send({message: req.user.name + ' disliked a post by ' + post.user + '.'}) // The response message indicates who disliked who's post.

    } catch (err) {
        res.status(500).send({message: err})
    }
})



// POST comment by post's id: Allows authorised users to comment on a post
router.post('/comment/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params
    const { text } = req.body

    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }

        // Fetch the post ID from the database and check if the post exists
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        // Calculating the time left for main post to expire to be presented in format that is easy to understand.
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check if the user is trying to comment their own post
        if (post.userId.toString() === req.user._id.toString()) {
            return res.status(403).send({message: 'Users cannot comment their own posts'})
        }

        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {  // If true, it returns a response with a '403 Forbidden' along with a message:
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // Record user interaction data with a post
        post.interactions.push({
            interactionTime: currentTime,
            interactionType: 'comment',
            userId: req.user._id,
            userName: req.user.name,
            text: text,
            postExpiresIn: friendlyFormat // Time left for the main post to expire (calculated above) presented in format that is easy to understand
        })

        await post.save()

        // The response message indicates who commented on whose post.
        res.send({message: req.user.name + ' commented on ' + post.user + "'s post: " + "'" + post.text + "'"}) 
    } catch (err) {
        res.status(500).send({message: err})
    }
})



// GET1  (Read all)
router.get('/', verifyToken, async(req, res) => {
    try {
        const getPosts = await Post.find().limit(10)   // Post is a model name from line 6.
        res.send(getPosts)                
    } catch (err) {
        res.status(400).send({message:err})
    }
})



// GET2 (the endpoint '/bytopic/:topic' for reading posts by topic)
router.get('/bytopic/:topic', verifyToken, async (req, res) => {
    const { topic } = req.params
    const { status, interest } = req.query

    try {
        const currentTime = new Date()
        let query = { topics: topic }

        if (status === 'live') {                         // e.g. with /bytopic/Tech?status=live
            query.expirationTime = { $gt: currentTime }  // we can read the active Tech posts.
        } else if (status === 'expired') {               // e.g. with /bytopic/Tech?status=expired
            query.expirationTime = { $lt: currentTime }  // we can read the Tech posts that expiration time has already passed.
        }

        if (interest === 'highest') {                    // e.g. with /bytopic/Tech?interest=highest
            query.expirationTime = { $gt: currentTime }  // exclude expired posts
            const postsByTopic = await Post.find(query)
                .select('-interactions')     // Hide interactions in response (to have clear picture)
                .sort({ interestScore: -1 }) // Sort in descending order (so the post with max value of InterestScore will be on the top)
                .limit(1)                    // Show just 1 post (with the highest score)  

            res.send(postsByTopic)
        } else {                                         // e.g. with /bytopic/Tech
            const postsByTopic = await Post.find(query)  // we can retrieve all posts ('live' and 'expired') in chosen topic category
                .limit(5)                                // limit applied in case of a response with large amount of posts

            res.send(postsByTopic)
        }
    } catch (err) {
        console.error(err)                               // Logs the error to the console
        res.status(500).send({message: 'Internal Server Error'}) // and sends the status 500 Internal Server Error response with message
    }
})



// GET3 (Read by post ID)
router.get('/:postId', verifyToken, async(req, res) => { 
    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }

        // Fetch the post ID from the database and check if the post exists
        const post = await Post.findById(req.params.postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        } 
        
        res.send(post)                
    } catch (err) {
        res.status(400).send({message:err})
    }
})



// PATCH (Get the post id from the user, match with post id in database and set/update the post data as stated)
router.patch('/:postId', verifyToken, async(req, res) => {
    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }

        // Fetch the post ID from the database and check if the post exists
        const post = await Post.findById(req.params.postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        } 

        // Check if the user is the owner of the post being updated
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({message: 'Users can only update their own posts'})
        }

        const currentTime = new Date()
        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (post.expirationTime <= currentTime) { // If true, it returns a response with a '403 Forbidden' along with a message:
            return res.status(403).send({message: 'Post has already expired; no further updates allowed'})
        }

        // Update the post if it's still active
        const updatePostById = await Post.updateOne({_id:req.params.postId},
            {
                $set:{
                    title:req.body.title,
                    topics:req.body.topics,
                    text:req.body.text,
                }
            },
            { runValidators: true } 
        )
        res.send(updatePostById)
    } catch (err) {
        res.send({message:err})
    }
})



// DELETE (Delete) a post by its id
router.delete('/:postId', verifyToken, async(req, res) => {
    const { postId } = req.params
    
    try {
        // An attempt to validate whether the provided post ID has a valid format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({message: 'Invalid post ID format'})
        }

        // Fetch the post ID from the database and check if the post exists
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }        

        // Check if the the user is trying to delete the post created by other user
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({message: 'Users can only delete their own posts'})
        }

        const currentTime = new Date()
        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (post.expirationTime <= currentTime) { // If true, it returns a response with a '403 Forbidden' along with a message:
            return res.status(403).send({message: 'Post has already expired; delation in not allowed'})
        }

        // Delete the post
        await Post.deleteOne({_id: postId})
        res.send({message: 'Post deleted successfully'})
    } catch (err) {
        res.status(500).send({message: err})
    }
})

module.exports = router