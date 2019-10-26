const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examssk: { 
        type: String, 
       // required: true, 
       // unique: true 
    },
    userName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    startTime: { // is not required because before startExam on login page value is null
        type: Date
    },
    finishTime: { 
        type: Date
    },
    examId:{
        type: String,
        required: true
    },
    participantExternalId:{
        type: String,
        required: true
    },
    examVersionExternalId:{
        type: String,
        required: true
    },
    examEventExternalId:{
        type: String,
        required: true
    },
    examVersionMaxPoints:{
        type: Number,
        required: true
    },
    examVersionPassingPoints:{
        type: Number,
        required: true
    },
    examSuccessPercent:{
        type: Number,
        required: true
    },
    started:{
        type: Boolean,
        required: true
    },
    finished:{
        type: Boolean,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    isCheated:{
        type: Boolean
    },
    resultProctorState:{
        type: Boolean
    },
    correctAnswers: {
        type: Number
    },
    wrongAnswers: {
        type: Number
    },
    examDurationTime: {
        type: Number
    },
    token: {
        type: String
    }
}, 
{ shardKey: { tag: 1, examssk: 1 }}
);

module.exports = mongoose.model('Exam', examSchema);

