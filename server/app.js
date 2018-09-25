'use strict'

require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hacktivoverflow',{ useNewUrlParser: true });

app.use(express.urlencoded({ extended : false}));
app.use(express.json());
app.use(cors());

//----> Define your routes here
const UserRouter = require('./routes/UserRouter');

//----> Call your routes here
app.use('/users',UserRouter);

app.get('/',(req,res)=>{
    res.send('OK')
    console.log('Set Up base ok')
})

app.listen( process.env.PORT,() => {
    console.log('You are listening to PORT 3000')
})