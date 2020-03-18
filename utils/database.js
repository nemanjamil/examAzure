var mongoose = require('mongoose');
const Exam = require('../models/exam');
const { validateIfStringExist } = require('../utils/common');

mongoose.Promise = global.Promise;
let client = null;
const basicsk = process.env.BASICSSK;

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
            readystate: mongoose.connection.readyState
        }
        return Promise.resolve(messageBody);
    } catch (error) {
        let messageBody = {
            message: error,   
            error: [error.message, error.name],  
            stateoferror: 99,  
            messagedesc: "Connection is not established",
            readystate: mongoose.connection.readyState
        }
        return Promise.reject(messageBody);
    }
}

const testIfExamIsInProgress = async (examId, context) => {
    context.log(" >>>> >>>> >>>> testIfExamIsInProgress examId : ", examId);

    try {
        await validateIfStringExist(examId)

        let exam = await Exam.findOne({ examId: examId, examssk : examId });
        if(exam.started && !exam.finished){
            let messageBody = {
                message: "Exam in progress",
                status: true
            }
            return Promise.resolve(messageBody);
        } else if (exam.finished) {
            
            let messageBody = {
                message: "Exam is finished, state of exam is finished in DB",
                error: "Exam is finished",  
                stateoferror: 21,
                status: false
            }
            return Promise.reject(messageBody);

        }else if(!exam.started){

            let messageBody = {
                message: "Exam is not started",
                error: "Exam is not started",  
                stateoferror: 22,
                status: false
            }
            return Promise.reject(messageBody);

        } else  {
            let messageBody = {
                message: "testIfExamIsInProgress findOne produce ERROR - IN ELSE QUERY - UNDEFINED",
                status: true,
                exam: exam
            }
            // this one is only Promise Resolve
            return Promise.resolve(messageBody)
        }

    } catch (error) {
         console.log("error 20 ", error);
         let messageBody = {
            message: error,
            error: [error.message, error.name],  
            stateoferror: 20,
            status: false 
        }
        return Promise.reject(messageBody)
    }
}

const getSpecificDataFromDB = async (fields) => {
    const Basics = require('../models/basic');
    try {
       const getData = await Basics.find({ name: fields, basicsk : basicsk });

        if (getData.length>0) {
            return getData;
        } else {
            
            let messageBody = {
                message: "Empty DB",
                error: result,  
                stateoferror: 23,
            }
            return Promise.reject(messageBody)
        }

    } catch (error) {
        let messageBody = {
            message: error,
            error: error,  
            stateoferror: 22
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