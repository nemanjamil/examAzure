
const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {

    const pictureId = req.body.pictureId;

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
        Picture.findOne({ pictureId: pictureId })
        .then(picture => {
            
            // if manuelno validira sliku else manuelno vraca u nevalidnu sliku
            // nevalidirajne je moguce samo za sliku koja je manuelno bila validirana
            if(picture.pictureJSON === "[]"){
                picture.pictureJSON = `[{"info": "Manually validated picture"}]`;
            }else if(picture.pictureJSON.substring(3,7) === "info"){
                picture.pictureJSON = `[]`;
            }
            
            return picture.save();
        })
        .then(res => {
            console.log("Updated successfully");
        })
        .catch(error => {
            console.log(error);
        });

        context.res = {
            status: 200,
        };
        context.done();

    } catch (error) {
        console.log(error)
        let messageBody = {
            message: "Error updating picture data"
        }
        return Promise.reject(messageBody)
    }
}




