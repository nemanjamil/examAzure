const Basics = require('../models/basic');

const { connectionToDB, closeMongoDbConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
const basicsk = process.env.BASICSSK;

module.exports = async function (context, req) {
  
    try {
        await connectionToDB();
        const getDbData = await getDataFromDB();
        let closeMongoDbConnectionRes = await closeMongoDbConnection();
        
        context.res = await responseOkJson(getDbData, { hasRespond : true });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

};

const getDataFromDB = async () => {
    try {
       
       let getData = await Basics.find({ basicsk : basicsk });
       
       if (getData.length>0) {
            return getData;
        } else {
            
            let messageBody = {
                message: "Empty DB",
                error: result,  
                stateoferror: 101,
            }
            return Promise.reject(messageBody)
        }
       
    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}
