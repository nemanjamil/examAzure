var mongoose = require('mongoose');
const Basics = require('../models/basic');
const { getSpecificDataFromDB, closeMongoDbConnection } = require('../utils/database');

const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {

    const fields = req.body.fields;
   
    try {
        if (!fields) await Promise.reject("Missing data field");
        await connectionToDB();
        const getDbData = await getSpecificDataFromDB(fields);
        let closeMongoDbConnectionRes = await closeMongoDbConnection();

        context.res = await responseOkJson(
            getDbData, 
            { 
                hasRespond : true, 
                closeMongoDbConnectionRes : closeMongoDbConnectionRes
            });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};


