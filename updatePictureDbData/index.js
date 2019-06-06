
const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');

/**
 * This fuction is used for Gallery to validate pictures
 */
module.exports = async function (context, req) {

    const pictureId = req.body.pictureId;

    try {
        await connectionToDB();
        await updatePictureInDB(context, pictureId);
        // responseOK
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updatePictureInDB = async (context, pictureId) => {

    try {
        const picture = await Picture.findOne({ pictureId: pictureId });

        let pictureJSON = await JSON.parse(picture.pictureJSON); // proveri za ovaj await da li treba [TODO] mirko
 
        let pictureJsonLgn = pictureJSON.length;
        // if picture was invalid, set tu manually valid picture
        if (pictureJsonLgn === 0) {
            picture.pictureJSON = `[{"info": "Manually validated picture"}]`;
        }
        // if picture was manually validated, set to invalid again 
        else if (pictureJSON[0].hasOwnProperty('info')) {
            picture.pictureJSON = `[]`;
        }
        // if picture was valid from start, set manually to invalid
        else if(pictureJsonLgn > 0){
            picture.pictureJSON = `[]`;
        }

        // verovatno cemo dobiti neki odgovor od picure save
        let pictureSave = await picture.save();

        return pictureSave;
        // ovde ne treba da bude odgovor
        context.res = {
            status: 200,
        };

        context.done();

    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating picture data"
        }
        return Promise.reject(messageBody);
    }
}