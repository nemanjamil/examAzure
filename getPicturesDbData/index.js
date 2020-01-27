const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) { 

    const examId = req.body.examId;

    try {
        await connectionToDB();
        await getDataFromDB(context, examId);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (context, examId) => {
    try {
        const result = await Picture.find({examId: examId});
        context.res = {
            status: 200,
            body: result
            // headers: {
            //     // 'Location': redirect
            // }
        };
        context.done();
    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}

