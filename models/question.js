const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    eventId:{
        type: Number,
        required: true
    },
    examName:{
        type: String,
        required: true
    },
    question:{
        type: String,
        required: true
    },
    answers: [{type: String}]
});

module.exports = mongoose.model('Question', questionSchema);