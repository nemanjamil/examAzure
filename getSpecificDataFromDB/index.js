const { getSpecificDataFromDB } = require('../utils/database');
const { connectionToDB, handleMongoConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');


module.exports = async function (context, req) {

    const fields = req.body.fields;
   
    try {
        if (!fields) await Promise.reject("Missing data field");
        await connectionToDB("getSpecificData");
        const getDbData = await getSpecificDataFromDB(fields);
        
        let handleMongoConn = await handleMongoConnection()
        context.res = await responseOkJson(
            getDbData, 
            { 
                hasRespond : true,
                "handleMongoConn" : handleMongoConn
            });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};


