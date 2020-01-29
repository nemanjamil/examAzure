var mongoose = require('mongoose');
const Exam = require('../models/exam');
mongoose.Promise = global.Promise;
let client = null;

const readyStateMongoose = async () => {
    return mongoose.connection.readyState
}
const closeMongoDbConnection = async () => {
    return await mongoose.connection.close();
}
const disconectFromDB =  async () => {
   return await mongoose.disconnect()
}
const connectionToDB = async () => {
  
    try {
        //mongoose.set('useCreateIndex', true) // or we can use in connect
        // &replicaSet=globaldb
        console.log('Pre Start Connection to CosmosDB successful');
        await mongoose.connect(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        });
        console.log('Connection to CosmosDB successful');
        let messageBody = {
            message: "Connection to CosmosDB successful",
            status: mongoose.connection.readyState
        }
        return Promise.resolve(messageBody);
    } catch (error) {
        let messageBody = {
            message: error
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
            message: error,
            value: false
        }
        return Promise.reject(messageBody)
    }
}

const getSpecificDataFromDB = async (fields) => {
    const Basics = require('../models/basic');
    try {
       const getData = await Basics.find({ name: fields });
       return getData;
    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}


module.exports = {
    connectionToDB,
    disconectFromDB,
    closeMongoDbConnection,
    readyStateMongoose,
    testIfExamIsInProgress,
    getSpecificDataFromDB
}