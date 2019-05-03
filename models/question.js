const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionssk: { 
        type: Number, 
       // required: true, 
        unique: true 
    },
    questionId:{
        type: String,
        required: true
    },
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
    examId:{
        type: String,
        required: true
    },
    answers: [{type: String}]
}, 
{ shardKey: { tag: 1, questionssk: 1 }}
);

module.exports = mongoose.model('Question', questionSchema);