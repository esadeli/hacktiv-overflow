'use strict'

const Comment = require('../models/comment');
const Article = require('../models/article');

class CommentController {

    // create comment
    static createComment(req,res){
        Comment.create({
            content : req.body.content,
            userIdComment : req.decoded.user_id,
            userfullname: req.decoded.name,
            articleId : req.body.articleId,
            commentUpVotes: [],
            commentDownVotes: []
        })
        .then(comment =>{
            let newComment = comment;
            //Update article
            Article.findOne({ _id: req.body.articleId })
                .then(article =>{
                    // console.log('Article -->',article)
                    article.update({
                        $push : { commentsList : newComment}
                    })
                    .then( row =>{            
                        res.status(200).json({ 
                            msg : 'Comment has been created',
                            data : newComment
                        })
                    })
                    .catch( error =>{
                        res.status(500).json({ msg : 'ERROR: ',error})
                    })
                })
                .catch(error =>{
                    res.status(500).json({ msg : 'ERROR: ',error})
                })
        })
        .catch(error =>{
            res.status(500).json({ msg : 'Error: ',error})
        })
    }

    // get list of comments of one article
    static getListOfComments(req,res){
        Comment.find({articleId : req.body.articleId})
            .then(comments=>{
                res.status(200).json({
                    msg : `list of comments with article id ${req.body.articleId}`,
                    data : comments
                })
            })
            .catch(error=>{
                res.status(500).json({ msg : 'Error: ',error});
            })
    }

    // update one comment
    static updateOneComment(req,res){
        Comment.findOne({_id: req.params.id})
            .then(commentFound =>{
                // check user
                if(commentFound.userIdComment == req.decoded.user_id){
                    // update content
                    commentFound.update({
                        content: req.body.content
                    })
                    .then(update =>{
                        res.status(200).json({
                            msg: 'Update comment success',
                            data: update
                        })
                    })
                    .catch(error =>{
                        res.status(500).json({ msg: 'Error: ',error})
                    })
                }else{
                    res.status(403).json({ msg: 'You can\'t edit other\'s comment '})
                }
            })
            .catch(error =>{
                res.status(500).json({ msg: 'Error: ',error});
            })
    }

    // upvote one comment
    static upVoteComment(req,res){
        Comment.findOne({ _id: req.params.id })
            .then(comment =>{

                // user can't self upvote
                if(comment.userIdComment != req.decoded.user_id){
                    // first timer
                    if(comment.commentUpVotes.indexOf(`${req.decoded.user_id}`) === -1){
                        comment.update({
                            $push: {
                                commentUpVotes: req.decoded.user_id
                            }
                        })
                        .then(commentUpdate =>{
                            res.status(200).json({
                                msg: 'Comment has been upvoted',
                                data: commentUpdate
                            })
                        })
                        .catch(error=>{
                            res.status(500).json({ mgs: 'Error: ',error});
                        })
                    }else if(comment.commentUpVotes.indexOf(`${req.decoded.user_id}`) !== -1){
                        comment.update({
                            $pull: {
                                commentUpVotes: req.decoded.user_id
                            }
                        })
                        .then(commentUpdate =>{
                            res.status(200).json({
                                msg: 'Upvote has been cancelled',
                                data: commentUpdate
                            })
                        })
                        .catch(error=>{
                            res.status(500).json({ mgs: 'Error: ',error});
                        })
                    }
                }else{
                    res.status(500).json({ msg: 'You can\'t upvote your own comment '})
                }
            })
            .catch(error =>{
                res.status(500).json({ msg: 'Error: ',error})    
            })
    }

    // downvote one comment
    static downVoteComment(req,res){
        Comment.findOne({ _id: req.params.id })
            .then(comment =>{

                // user can't self upvote
                if(comment.userIdComment != req.decoded.user_id){
                    // first timer
                    if(comment.commentDownVotes.indexOf(`${req.decoded.user_id}`) === -1){
                        comment.update({
                            $push: {
                                commentDownVotes: req.decoded.user_id
                            }
                        })
                        .then(commentUpdate =>{
                            res.status(200).json({
                                msg: 'Comment has been downvoted',
                                data: commentUpdate
                            })
                        })
                        .catch(error=>{
                            res.status(500).json({ mgs: 'Error: ',error});
                        })
                    }else if(comment.commentDownVotes.indexOf(`${req.decoded.user_id}`) !== -1){
                        comment.update({
                            $pull: {
                                commentDownVotes: req.decoded.user_id
                            }
                        })
                        .then(commentUpdate =>{
                            res.status(200).json({
                                msg: 'Downvote has been cancelled',
                                data: commentUpdate
                            })
                        })
                        .catch(error=>{
                            res.status(500).json({ mgs: 'Error: ',error});
                        })
                    }
                }else{
                    res.status(500).json({ msg: 'You can\'t downvote your own comment '})
                }
            })
            .catch(error =>{
                res.status(500).json({ msg: 'Error: ',error})    
            })
    }
}

module.exports = CommentController