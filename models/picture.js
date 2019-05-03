const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    // picturessk: { 
    //     type: Schema.Types.ObjectId,
    //     required: true, 
    //     unique: true 
    // },
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
// { 
//     shardKey: { tag: 1, name: 1 } 
// }
);

module.exports = mongoose.model('Picture', pictureSchema);