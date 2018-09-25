'use strict'

'use strict'

const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const IsLogin = require('../middlewares/IsLogin');

// add individual comment
router.post('/',IsLogin,(req,res)=>{
    CommentController.createComment(req,res);
})

// get list of all comment of one article
router.post('/lists',(req,res)=>{
    CommentController.getListOfComments(req,res);
})

// update one comment
router.put('/edit/:id',IsLogin,(req,res)=>{
    CommentController.updateOneComment(req,res);
})

// upvote one comment
router.post('/upvote/:id',IsLogin,(req,res)=>{
    CommentController.upVoteComment(req,res);    
})

// downvote one comment
router.post('/downvote/:id',IsLogin,(req,res)=>{
    CommentController.downVoteComment(req,res);
})

module.exports = router