const { responseOkJson, responseErrorJson } = require( '../utils/common');
const { connectionToDB } = require('../utils/database');
const Basic = require('../models/basic');
const basicsk = process.env.BASICSSK;



module.exports = async function (context, req) {

    const newOrEditOrDelete = req.body.newOrEditOrDelete;
    let baseField = req.body.baseField;

    try {
        await connectionToDB();

        let result = null;

        if(newOrEditOrDelete === 'new'){
            result = await saveBaseField(baseField);
        }else if(newOrEditOrDelete === 'edit'){
            result = await editBaseField(baseField);
        }else if(newOrEditOrDelete === 'delete'){
            result = await deleteBaseField(baseField);
        }
        
        context.res = await responseOkJson(result);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
   
};

async function saveBaseField(baseField){
    
    try {

        const basic = new Basic({
            name: baseField.name,
            value: baseField.value,
            project: baseField.project,
            page: baseField.page,
            basicsk: basicsk
        });

        const result = await basic.save();
        return result;
        
     } catch (error) {
         let messageBody = {
             message: error
         }
         return Promise.reject(messageBody)
     }
}

async function editBaseField(baseField){
    
    try {

        const result = await Basic.updateOne(
            {'basicsk' : basicsk, "_id" : baseField._id},
            {"$set":{
                "name" : baseField.name,
                "value": baseField.value,
                "project": baseField.project,
                "page": baseField.page
            }}
        );

        return result;
        
     } catch (error) {
         let messageBody = {
             message: error
         }
         return Promise.reject(messageBody)
     }
}

async function deleteBaseField(baseField){
    
    try {

        const result = await Basic.deleteOne({'basicsk' : basicsk, '_id': baseField._id});

        return result;
        
     } catch (error) {
         let messageBody = {
             message: error
         }
         return Promise.reject(messageBody)
     }
}