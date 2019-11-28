var mongoose = require('mongoose');
const Basics = require('../models/basic');

const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {

    const field = req.body.field;
   
    try {
        if (!field) await Promise.reject("Missing data field");
        await connectionToDB();
        const getDbData = await getSpecificDataFromDB(field);
        context.res = await responseOkJson(getDbData, { hasRespond : true });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

};

const getSpecificDataFromDB = async (field) => {
    try {
       const getData = await Basics.find({ name: field });
       return getData[0].value;
    } catch (error) {
        let messageBody = {
            message: "Error fetching data"
        }
        return Promise.reject(messageBody)
    }
}
