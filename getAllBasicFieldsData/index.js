const { responseOkJson, responseErrorJson } = require( '../utils/common');
const { connectionToDB } = require('../utils/database');
const Basic = require('../models/basic');
const basicssk = process.env.BASICSSK;



module.exports = async function (context, req) {

    try {
        await connectionToDB();
        let getLanguageDataResult = await getAllBasicFieldsData();
        context.res = await responseOkJson(getLanguageDataResult);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
   
};

async function getAllBasicFieldsData(){
    try {
       
        let getData = await Basic.find({ basicssk : basicssk });
        
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