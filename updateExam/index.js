const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {

    // this endpoint is calling and from exam app and exam admin app
    // exam admin app don't have token property
    // exam have token but is not used here (because admin app don't have token)

    // IMPORTANT: need secure this endpoint FOR USE IN EXAM APP WITHOUT TOKEN




    // request input data example
    // examId is required
    // other properties are optional, it's logical to have one property which is updating
    // {
    //     "examId" : "169_123_684",
    //     "isCheated" : false,
    //     "other exam property" : "value" 
    // } 

    const { examId } = req.body;

    let updateProperties = [];

    for (let key in req.body) {
        if (key !== 'examId') {
            updateProperties.push({
                name: key,
                value: req.body[key]
            });
        }
    }

    try {
        await connectionToDB();
        await updateExam(examId, updateProperties);
        context.res = {
            status: 200,
        };
        context.done();
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updateExam = async (examId, updateProperties) => {

    try {
        const exam = await Exam.findOne({ examId: examId });

        for (let key in updateProperties) {
            exam[updateProperties[key].name] = updateProperties[key].value;
        }

        await exam.save();

    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating exam"
        }
        return Promise.reject(messageBody)
    }
}





