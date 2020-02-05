const { responseOkJson, responseErrorJson, nameVariables } = require( '../utils/common');
const { connectionToDB } = require('../utils/database');
const Basic = require('../models/basic');



module.exports = async function (context, req) {
   
    const data = req.body;
    
    try {
        await connectionToDB();
        await deleteParametersfromDB();
        let preparedParameters = await prepareParametersForInsert(data)
        let responseFromDb = await saveParameterstoDb(preparedParameters);
        context.res = await responseOkJson(responseFromDb);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
   
};

async function prepareParametersForInsert(data){
    return data.map(el => {
        delete el._id;
        delete el.time;
        el.basicsk = nameVariables.basicsk
        return el
    });
}

async function deleteParametersfromDB(){
    try {
        const res = await Basic.deleteMany({basicsk : nameVariables.basicsk});
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function saveParameterstoDb(data){
    try {
        const insertMany = await Basic.insertMany(data);
        return insertMany;
    } catch (error) {
        return Promise.reject(error);
    }
}