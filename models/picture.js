const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    picturessk: { 
        type: Number, // Schema.Types.ObjectId, // Number,  // type:
        required: true, 
        unique: true 
    },
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
}, 
{ shardKey: { tag: 1, picturessk: 1 }}
);

module.exports = mongoose.model('Picture', pictureSchema);