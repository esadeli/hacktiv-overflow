'use strict'

const User = require('../models/user');
// const jwt = require('jsonwebtoken');
const Article = require('../models/article');
// const Comment = require('../models/comment');

class ArticleController{

    static createArticle(req,res){

        Article.create({
            title : req.body.title,
            description : req.body.description,
            userId : req.decoded.user_id,
            commentsList : []
        })
        .then(article=>{
            let newArticle = article
            // console.log('Article -->',newArticle)

            //update user
            User.findOne({_id : req.decoded.user_id})
                .then(user =>{
                    // console.log('User-->',user)
                    user.update({
                        $push : {
                            articlesList : newArticle
                        }
                    })
                    .then(row=>{
                        // console.log('ROW--->',row)
                        res.status(200).json({ 
                            msg : `Article with name ${article.title} has been created`,
                            data : newArticle
                        })
                    })
                    .catch(error =>{
                        res.status(500).json({ msg : 'ERROR: ',error})
                    })
                })
                .catch(error =>{
                    res.status(500).json({ msg: 'ERROR: ',error})
                })
        })
        .catch(error =>{
            res.status(500).json({ msg : 'ERROR: ',error })
        })
    }

    // get list of articles
    static getListOfArticles(req,res){
        Article.find({}).populate('commentsList').populate('upVotesList').populate('downVotesList')
            .then(articles=>{
                res.status(200).json({
                    msg : 'List of articles',
                    data : articles
                })
            })
            .catch(error =>{
                res.status(500).json({ msg : error })
            })
    }

    // get one article
    static getOneArticle(req,res){
        Article.findOne({_id : req.params.id}).populate('commentsList').populate('upVotesList').populate('downVotesList')
            .then(article =>{
                res.status(200).json({ 
                    msg : 'Detail of article',
                    data : article
                })
            })
            .catch(error =>{
                res.status(500).json({ msg : 'Error: ',error})
            })
    }

    // edit one article
    static editOneArticle(req,res){
        // console.log('PARAM----->',req.params.id)
        Article.findOne({_id : req.params.id})
            .then(articleFound=>{
                let initialComments = articleFound.commentsList
                let initialUpVote = articleFound.upVoteList
                let initialDownVote = articleFound.downVoteList
                // article found
                if(articleFound){
                    // verify token and userId in article
                    if(articleFound.userId==req.decoded.user_id){

                        // let update this article
                        Article.findOneAndUpdate({ _id: req.params.id },{
                            title: req.body.title,
                            description: req.body.description,
                            userId: req.decoded.user_id, 
                            commentsList: initialComments,
                            upVoteList: initialUpVote,
                            downVoteList: initialDownVote
                        })
                        .then(article =>{
                            // console.log('Article-->',article)
                            res.status(200).json({
                                msg : `Article has with title ${article.title} been edited`,
                                data : article
                            })
                        })
                        .catch(error =>{
                            res.status(500).json({ msg : 'Error: ',error});
                        })

                    }else{
                        res.status(401).json({ msg : 'You are not authorized to edit this article'})
                    }

                }else{
                    //this article is not found
                    res.status(500).json({ msg : 'Article is not found'})
                }
            })
            .catch(error =>{
                res.status(500).json({ msg : 'Error: ',error})
            })
    }

    // Delete one article
    static deleteOneArticle(req,res){
        Article.findOne({ _id : req.params.id })
            .then(articleFound=>{
                if(articleFound){
                    //verify the user
                    if(articleFound.userId == req.decoded.user_id){

                        // final step delete the article
                        Article.findOneAndRemove({_id : req.params.id})
                            .then(article =>{
                                res.status(200).json({ 
                                    msg : `Article with title ${article.title} has been deleted`,
                                    data : article
                                })
                            })
                            .catch(error =>{
                                res.status(500).json({ msg : 'Error ',error})
                            })
                        // delete all the existing comment in comment table first
                        // Comment.deleteMany({ articleId : req.params.id})
                        //     .then(comments=>{
                        //         // successful delete of all comments if any

                        //         // final step delete the article
                        //         Article.findOneAndRemove({_id : req.params.id})
                        //             .then(article =>{
                        //                 res.status(200).json({ 
                        //                     msg : `Article with title ${article.title} has been deleted`,
                        //                     data : article
                        //                 })
                        //             })
                        //             .catch(error =>{
                        //                 res.status(500).json({ msg : 'Error ',error})
                        //             })
                        //     })
                        //     .catch(error =>{
                        //         res.status(500).json({ msg : 'Error: ',error})
                        //     })
                    }else{
                        res.status(401).json({ msg : 'You are not authorized to delete this article'});
                    }
                }else{
                    res.status(500).json({ msg : 'Article is not found'})
                }
            })
            .catch(error=>{
                res.status(500).json({ msg : 'Error: ',error})
            })
    }

    // upvote articles
    static upVoteArticle(req,res) {
        Article.findOne({_id: req.params.id})
            .then( article =>{

                // check status to prevent double vote
                if(article.upVotesList.indexOf(`${req.decoded.user_id}`) === -1){
                    //Update article
                    article.update({
                        $push: {
                            upVotesList: req.decoded.user_id 
                        }
                    })
                    .then( articleupvote =>{
                        res.status(200).json({
                            msg: 'Article has been upvoted',
                            data: articleupvote
                        })
                    })
                    .catch( error => {
                        res.status(500).json({ msg: 'ERROR: ',error})
                    })
                }else if(article.upVotesList.indexOf(`${req.decoded.user_id}`) !== -1){
                    //Update article
                    article.update({
                        $pull: {
                            upVotesList: req.decoded.user_id
                        }
                    })
                    .then( articleupvote =>{
                        res.status(200).json({
                            msg: 'Upvote cancelled',
                            data: articleupvote
                        })
                    })
                    .catch( error => {
                        res.status(500).json({ msg: 'ERROR: ',error})
                    })
                }
            })
            .catch( error => {
                res.status(500).json({ msg: 'Error: ',error})
            })
    }

    // downvote articles
    static downVoteArticle(req,res){
        Article.findOne({_id: req.params.id})
            .then(article =>{

                // check status to prevent double vote
                if(article.downVotesList.indexOf(`${req.decoded.user_id}`) === -1){
                    article.update({
                        $push: {
                            downVotesList: req.decoded.user_id 
                        }
                    })
                    .then( articledownvote =>{
                        res.status(200).json({
                            msg: 'Articles has been downvoted',
                            data: articledownvote
                        })
                    })
                    .catch( error=>{
                        res.status(500).json({ msg: 'ERROR: ',error})
                    })
                }else if(article.downVotesList.indexOf(`${req.decoded.user_id}`) !== -1){
                    article.update({
                        $pull: {
                            downVotesList: req.decoded.user_id 
                        }
                    })
                    .then( articledownvote =>{
                        res.status(200).json({
                            msg: 'Downvote has been cancelled',
                            data: articledownvote
                        })
                    })
                    .catch( error=>{
                        res.status(500).json({ msg: 'ERROR: ',error})
                    })
                }
            })
            .catch(error => {
                res.status(500).json({ msg: 'Error: ',error})
            })
    }
}

module.exports = ArticleController