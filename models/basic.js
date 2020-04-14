const mongoose = require('mongoose');
const { connection } = require('../utils/database');
const Schema = mongoose.Schema;

const basicSchema = new Schema({
    basicssk: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: false
    },
    page: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },

}, 
{ shardKey: { basicssk: 1 }}
);

module.exports = connection.model('Basics', basicSchema);
