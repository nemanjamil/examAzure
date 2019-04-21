const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    pictureId: {
       type: String,
       required: true 
    },
    eventId:{
        type: Number,
        required: true
    },
    examId:{
        type: String,
        required: true
    },
    questionId:{
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Picture', pictureSchema);