
const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
const picturessk = process.env.PICTURESSK;

/**
 * This function is used in Gallery to switch status of exam all pictures 
 */
module.exports = async function (context, req) {

    const examId = req.body.examId;
    const validationType = req.body.validationType;

    try {

        await connectionToDB();

        const updateAllExamPicturesColor = await updateAllExamPictures(context, examId, validationType);

        context.res = await responseOkJson(updateAllExamPicturesColor);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updateAllExamPictures = async (context, examId, validationType) => {

    try {

        let stateOfPicture = 1;

        switch(validationType){
            case 'validPicture': stateOfPicture = 1; break;
            case 'noFacePicture': stateOfPicture = 0; break;
            case 'moreThenOnePersons': stateOfPicture = 2; break;
            default: stateOfPicture = 1;
        }

        const result = await Picture.updateMany(
                {'picturessk' : picturessk, "examId" : examId},
                {"$set":{"stateOfPicture" : stateOfPicture}}, 
                {"multi": true}, 
                (err, writeResult) => {
                    if(err){
                        console.log(err);
                    }else if(writeResult){
                        console.log(writeResult);
                    }               
                });

        return result;

    } catch (error) {

        let messageBody = {
            message: "Error updating pictures data"
        }
        return Promise.reject(messageBody);
    }
}