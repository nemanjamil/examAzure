var mongoose = require('mongoose');
const Basics = require('../models/basic');

const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
const basicsk = process.env.BASICSSK;

module.exports = async function (context, req) {
  
    try {
        await connectionToDB();
        const getDbData = await getDataFromDB();
        context.res = await responseOkJson(getDbData, { hasRespond : true });
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

};

const getDataFromDB = async () => {
    try {
       
       const getData = await Basics.find({ basicsk : basicsk });
       return getData;
    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}
