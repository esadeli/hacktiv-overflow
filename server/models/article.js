'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title : {
        type : String
    },
    description : {
        type : String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    commentsList : [{
        type: String
        // type : Schema.Types.ObjectId,
        // ref : 'Comment'
    }],
    upVoteList : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    downVoteList : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }]  
},{
    timestamps : true
})

const Article = mongoose.model('Article',ArticleSchema);

module.exports = Article;
