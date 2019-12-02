var mongoose = require('mongoose');
const Basics = require('../models/basic');

const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {

    const fields = req.body.fields;
   
    try {
        if (!fields) await Promise.reject("Missing data field");
        await connectionToDB();
        const getDbData = await getSpecificDataFromDB(fields);
        context.res = await responseOkJson(getDbData, { hasRespond : true });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

};

const getSpecificDataFromDB = async (fields) => {
    try {
       const getData = await Basics.find({ name: fields });
       return getData;
    } catch (error) {
        let messageBody = {
            message: "Error fetching data"
        }
        return Promise.reject(messageBody)
    }
}
