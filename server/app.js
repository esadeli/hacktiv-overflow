'use strict'

require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hacktivoverflow',{ useNewUrlParser: true });

app.get('/',(req,res)=>{
    console.log('Set Up base ok')
})

app.listen( process.env.PORT,() => {
    console.log('You are listening to PORT 3000')
})