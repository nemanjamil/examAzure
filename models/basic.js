const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const basicSchema = new Schema({
    basicsk: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    keyroot: {
        type: String,
        required: true
    },
    keyvalue: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },

}, 
{ shardKey: { tag: 1, basicsk: 1 }}
);

module.exports = mongoose.model('Basics', basicSchema);
