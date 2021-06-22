const { Double } = require('mongodb');
const mongoose = require('mongoose');

const UserMessage = mongoose.Schema({
    userId :{
        type : String,
        require : true
    },
    userDate :{
        type : String,
        require : true
    }
})

module.exports = mongoose.model('user',UserMessage);