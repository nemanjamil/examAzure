const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examssk: { 
        type: Number, 
        required: true, 
        unique: true 
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
    examId:{
        type: String,
        required: true
    }
}, 
{ shardKey: { tag: 1, examssk: 1 }}
);

module.exports = mongoose.model('Exam', examSchema);

