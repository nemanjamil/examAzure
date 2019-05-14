
const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {

    const pictureId = req.body.pictureId;

    console.log("------ Development -------------");
    console.log(req.body);

    try {
        await connectionToDB();
        await updatePictureInDB(context, pictureId);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updatePictureInDB = async (context, pictureId) => {

    try {
        const picture = await Picture.findOne({ pictureId: pictureId });

        let pictureJSON = JSON.parse(picture.pictureJSON);

        // if manuelno validira sliku else manuelno vraca u nevalidnu sliku
        // nevalidirajne je moguce samo za sliku koja je manuelno bila validirana
        if (pictureJSON.length === 0) {
            picture.pictureJSON = `[{"info": "Manually validated picture"}]`;
        } else if (pictureJSON[0].hasOwnProperty('info')) {
            picture.pictureJSON = `[]`;
        }

        await picture.save();


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




