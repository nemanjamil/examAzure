const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {
    context.log('Get PICTURES INFO FROM LIST OF EXAMS - context');

    const tablePage = req.body.page;
    const rowsPerTablePage = req.body.rowsPerPage;

    try {
        await connectionToDB();
        const data = await getDataFromDB(tablePage, rowsPerTablePage);

        // According to data get all json from tables
        

        context.res = await responseOkJson(data);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }
};



const getDataFromDB = async (tablePage, rowsPerTablePage) => {
    try {

        const numberOfExams = await Exam.estimatedDocumentCount();
        
        const result = await Exam.find({}, null, {sort: {_id: 'descending'}})
        .skip(tablePage*rowsPerTablePage)
        .limit(rowsPerTablePage);

        const data = {
            numberOfExams: numberOfExams,
            examsList: result
        }
        return data;

    } catch (error) {
        let messageBody = {
            message: "Error fetching data dddd"
        }
        return Promise.reject(messageBody)
    }
}