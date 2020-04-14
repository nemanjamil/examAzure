
const Picture = require('../models/picture');
const { handleMongoConnection} = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
/**
 * This fuction is used for Gallery to validate pictures
 */
module.exports = async function (context, req) {

    const pictureId = req.body.pictureId;
    const validationType = req.body.validationType;
    const examId = req.body.examId;

    try {
        // await connectionToDB("updatePictureDbData");
        const { pictureSave, examCost } = await updatePictureInDB(context, pictureId, validationType, examId);

        let handleMongoConn = await handleMongoConnection()
        context.res = await responseOkJson(pictureSave, [examCost,handleMongoConn]);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updatePictureInDB = async (context, pictureId, validationType, examId) => {

    try {
        const picture = await Picture.findOne({ pictureId: pictureId, picturessk : examId });

        // let pictureJSON = await JSON.parse(picture.pictureJSON); 
 
        // let pictureJsonLgn = pictureJSON.length;
        // // if picture was invalid, set tu manually valid picture
        // if (pictureJsonLgn === 0) {
        //     picture.pictureJSON = `[{"info": "Manually validated picture"}]`;
        // }
        // // if picture was manually validated, set to invalid again 
        // else if (pictureJSON[0].hasOwnProperty('info')) {
        //     picture.pictureJSON = `[]`;
        // }
        // // if picture was valid from start, set manually to invalid
        // else if(pictureJsonLgn > 0){
        //     picture.pictureJSON = `[]`;
        // }

        switch(validationType){
            case 'validPicture': picture.stateOfPicture = 1; break;
            case 'noFacePicture': picture.stateOfPicture = 0; break;
            case 'moreThenOnePersons': picture.stateOfPicture = 2; break;
            default: picture.stateOfPicture = 1;
        }

        let pictureSave = await picture.save();

        let examCost = "";
        if (process.env.EXAM_COST==="true") {
            examCost = await picture.db.db.command({getLastRequestStatistics:1});
        };

        pictureSave = pictureSave.toObject();
        delete pictureSave['_id'];
        delete pictureSave['picturessk'];
        return { pictureSave, examCost} ;

    } catch (error) {

        let messageBody = {
            message: "Error updating picture data"
        }
        return Promise.reject(messageBody);
    }
}