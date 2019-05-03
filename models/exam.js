const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
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
});

module.exports = mongoose.model('Exam', examSchema);

