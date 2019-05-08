var mongoose = require('mongoose');
const Basics = require('../models/basic');

const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');


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
       const getData = await Basics.find();
       return getData;
    } catch (error) {
        let messageBody = {
            message: "Error fetching data"
        }
        return Promise.reject(messageBody)
    }
}
