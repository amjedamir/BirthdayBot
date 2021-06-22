const { Double } = require('mongodb');
const mongoose = require('mongoose');

const Server = mongoose.Schema({
    id :{
        type : String,
        require : true
    },
    ownerid :{
        type : String,
        require : true
    },
    birthday_channel :{
        type : String,
        require : false
    },
    prefix :{
        type : String,
        require : false
    },
    banned : {
        type : Boolean,
        require : true
    }
})

module.exports = mongoose.model('data',Server);