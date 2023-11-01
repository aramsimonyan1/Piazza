const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
//const { text } = require('body-parser')  <= unauthorised users can post
const verifyToken = require('../verifyToken')

// POST (this method Create data in MongoDB based on what user gives us)
router.post('/', verifyToken, async(req, res)=> {

    const postData = new Post ({ // creating json object for a database
        user:req.body.user,
        title:req.body.title, 
        text:req.body.text,
        location:req.body.location
    })

    //try to insert...
    try {
        const postToSave = await postData.save() 
        res.send(postToSave)                  
    }catch(err){
        res.send({message:err})
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
router.patch('/:postId', verifyToken, async(req, res) =>{
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
router.delete('/:postId', verifyToken, async(req, res)=>{
    try{
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.status(500).send({message:err})
    }
})

module.exports = router