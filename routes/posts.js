const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Post = require('../models/Post')
//const { text } = require('body-parser')  <= unauthorised users can post
const verifyToken = require('../verifyToken')

// POST (this method Create data in MongoDB based on what user gives us)
router.post('/', verifyToken, async(req, res) => {

    const { user, title, topics, text, duration } = req.body
    const currentTime = new Date()

    // Calculate the expiration time based on the current time and duration.
    const expirationTime = new Date(currentTime.getTime() + duration * 60000) // Convert minutes to milliseconds

    const postData = new Post ({ // creating json object for a database
        user:user,
        title:title,
        topics:topics,
        text:text,
        duration:duration,
        expirationTime:expirationTime,
        status: 'Live',
    })

    //try to insert...
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
            // Log the content of req.user for debugging
            console.log('User Information:', req.user);

        const post = await Post.findById(postId) // fetches the post by its ID

        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()
        //const expirationTime = new Date(post.createdAt.getTime() + post.duration * 60000); // Convert minutes to milliseconds

        //Check wether the expirationTime of a post object retrieved from the database has passed.
        if (currentTime > post.expirationTime) {
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // "like" operation on the post.
        post.likes += 1

        // Record user interaction data with a post
        const interactionData = {
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            interaction: 'like',
            timeLeft: post.expirationTime - currentTime, // Time left for the post to expire
        };

        console.log('Interaction Data:', interactionData);
        post.interactions.push(interactionData);

        await post.save()

        res.send({message: 'Post liked successfully'})
    } catch (err) {
        res.status(500).send({message: err})
    }
})



// POST (This method allows authorised users to dislike a post)
router.post('/dislike/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params

    try {
        // Log the content of req.user for debugging
        console.log('User Information:', req.user);
        
        const post = await Post.findById(postId) // fetches the post by its ID

        if (!post) {
            return res.status(404).send({message: 'Post not found'})
        }

        const currentTime = new Date()

        //The post object retrieved from the database should include the expirationTime stored in the PostSchema
        if (currentTime > post.expirationTime) {
            return res.status(403).send({message: 'Post has expired; no further interactions allowed'})
        }

        // Perform the "dislike" operation on the post.
        post.dislikes += 1
        
        // Record user interaction data with a post
        const interactionData = {
            userId: req.user._id, // we have user data in the request (from token)
            userName: req.user.name, 
            interaction: 'dislike',
            timeLeft: post.expirationTime - currentTime, // Time left for the post to expire
        };

        post.interactions.push(interactionData);
        
        await post.save()

        res.send({message: 'Post disliked successfully'})
    } catch (err) {
        res.status(500).send({message: err})
    }
})



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