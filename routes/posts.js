const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Post = require('../models/Post')
const verifyToken = require('../verifyToken') // using:  const { text } = require('body-parser')   also unauthorised users could post

// POST (this method creates data/post in MongoDB based on what user gives us)
router.post('/', verifyToken, async(req, res) => {
    const { title, topics, text, duration } = req.body
    const currentTime = new Date()

    // Calculate the expiration time based on the current time and duration.
    const expirationTime = new Date(currentTime.getTime() + duration * 60000) //  It's essential to multiply duration by 60000 to convert it to milliseconds before adding it to the current time.

    // Extract user information from the authenticated token which includes the username (name).
    const { _id, name } = req.user

    // Creating json object for a database
    const postData = new Post ({ 
        user: name, // Use the username from the authenticated token
        title: title,
        topics: topics,
        text: text,
        duration: duration,
        expirationTime: expirationTime,
        status: 'Live',
    })

    try {
        const postToSave = await postData.save() 
        res.send(postToSave)                  
    }catch(err){
        res.send({message:err})
    }
})


// POST (This method allows authorised users to like a post)
router.post('/like/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params

    try {
        const post = await Post.findById(postId) // fetches the post by its ID

        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // "like" operation on the post.
        post.likes += 1

        // Record user interaction data with a post
        post.interactions.push({
            interactionTime: currentTime,
            interactionType: 'like',
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            postExpiresIn: friendlyFormat,
        })

        await post.save()

        res.send({message: 'Post liked successfully'})
    } catch (err) {
        res.status(500).send({message: err})
    }
})



// POST (This method allows authorised users to dislike a post)
router.post('/dislike/:postId', verifyToken, async(req, res) => {
    const { postId } = req.params

    try {
        // Log the content of req.user for debugging
        console.log('User Information:', req.user);
        
        const post = await Post.findById(postId) // fetches the post by its ID
        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check wether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // "dislike" operation on the post.
        post.dislikes += 1
        
        // Record user interaction data with a post
        const interactionData = {
            interactionTime: currentTime,
            interactionType: 'dislike',
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            postExpiresIn: friendlyFormat // Time left for the post to expire
        }
        post.interactions.push(interactionData)
        
        await post.save()

        res.send({message: 'Post disliked successfully'})
    } catch (err) {
        res.status(500).send({message: err})
    }
})



// POST (This method allows authorised users to comment on a post)
router.post('/comment/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const currentTime = new Date()
        const postExpiresInMinutes = Math.floor((post.expirationTime - currentTime) / 60000)
        const postExpiresInSeconds = Math.floor(((post.expirationTime - currentTime) % 60000) / 1000)
        const friendlyFormat = `${postExpiresInMinutes} minutes and ${postExpiresInSeconds} seconds`

        // Check if the post has expired
        if (currentTime > post.expirationTime) {
            return res.status(403).send({ message: 'Post has expired; no further interactions allowed' });
        }

        // Record user interaction data with a post
        post.interactions.push({
            interactionTime: currentTime,
            interactionType: 'comment',
            userId: req.user._id,
            userName: req.user.name,
            text: text,
            postExpiresIn: friendlyFormat, // Time left for the main post to expire
        });

        await post.save();

        res.send({ message: 'Comment added successfully' });
    } catch (err) {
        res.status(500).send({ message: err });
    }
});




// GET 1  (Read all)
router.get('/', verifyToken, async(req, res) => {
    // Post is a model name from line 4.  // if it works send the posts back 
    try {
        const getPosts = await Post.find().limit(10)  
        res.send(getPosts)                
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET 2  (Read by ID)
router.get('/:postId', verifyToken, async(req, res) => { 
    try {
        const getPostById = await Post.findById(req.params.postId) 
        res.send(getPostById)                
    }catch(err){
        res.status(400).send({message:err})
    }

})

// PATCH (get the post id from the user, match with post id in database and set/update the post data as stated
router.patch('/:postId', verifyToken, async(req, res) => {
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                user:req.body.user,
                title:req.body.title,
                text:req.body.text,
                location:req.body.location,
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }
})

// DELETE (Delete) a post by its id
router.delete('/:postId', verifyToken, async(req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send({message: 'Invalid post ID format'});
    }
    
    try{
        const deletePostById = await Post.deleteOne({_id: postId});
        if (deletePostById.n === 0) {
            // No documents were deleted, which means the post was not found.
            return res.status(404).send({message: 'Post not found'});
        }
        res.send(deletePostById)
    }catch(err){
        res.status(500).send({message:err})
    }
})

module.exports = router