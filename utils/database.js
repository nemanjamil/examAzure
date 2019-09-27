var mongoose = require('mongoose');
const Exam = require('../models/exam');

const connectionToDB = async () => {

    try {
        //mongoose.set('useCreateIndex', true) // or we can use in connect
        await mongoose.connect(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true&replicaSet=globaldb", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        });
        console.log('Connection to CosmosDB successful');
        let messageBody = {
            message: "Connection to CosmosDB successful"
        }
        return Promise.resolve(messageBody);
    } catch (error) {
        let messageBody = {
            message: "Error Connecting to CosmosDB"
        }
        return Promise.reject(messageBody);
    }
}

const testIfExamIsInProgress = async (examId) => {
    try {
        const exam = await Exam.findOne({ examId: examId });
        if(exam.started && !exam.finished){
            let messageBody = {
                message: "Exam in progress",
                value: true
            }
            return Promise.resolve(messageBody);
        }else if(exam.finished){
            let messageBody = {
                message: "Exam is finished",
                value: false
            }
            return Promise.reject(messageBody);
        }else if(!exam.started){
            let messageBody = {
                message: "Exam is not started",
                value: false
            }
            return Promise.reject(messageBody);
        }
    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error fetching exam data",
            value: false
        }
        return Promise.reject(messageBody)
    }
}

module.exports = {
    connectionToDB,
    testIfExamIsInProgress
}