var mongoose = require('mongoose');
const { validateIfStringExist } = require('../utils/common');
const basicssk = process.env.BASICSSK;

const handleMongoConnection = async () => {
    let disconnectState = "" //await disconectFromDB()
    let closeMongoDbConnectionRes = "" // await closeMongoDbConnection()
    let readyState = ""; // await readyStateMongoose()
    return {
        readyState,
        disconnectState,
        closeMongoDbConnectionRes
    }
}

const readyStateMongoose = async (parentFunction=null) => {
    return mongoose.connection.readyState
}
const closeMongoDbConnection = async (parentFunction=null) => {
    return await mongoose.connection.close();
}
const disconectFromDB =  async (parentFunction=null) => {
    return await mongoose.disconnect()
}

const connection = mongoose.createConnection(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true", { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,

    bufferCommands: false,
    autoCreate: false,
    poolSize: 10,

    autoIndex : true, 
    useCreateIndex : true,
   
    auth: {
        user: process.env.COSMODDB_USER,
        password: process.env.COSMOSDB_PASSWORD
    }
});



const connectionToDB = async (functionName=null) => {
    
    let stateOfMongoConnection = await readyStateMongoose();
    //console.log('Pre Start MongoDB Conn : ', functionName, stateOfMDB);
    
    try {
        // mongoose.set('useCreateIndex', true) // or we can use in connect
        // &replicaSet=globaldb
        console.log("START connectionToDB=1", "stateOfmongo: "+await readyStateMongoose(), functionName);
        //await varifyDbState(0);
        console.log("FINISH connectionToDB=2", "stateOfmongo: "+await readyStateMongoose(), functionName);
     
        await mongoose.createConnection(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true", { // https://mongoosejs.com/docs/connections.html
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                autoIndex : true, 
                useCreateIndex : true,
    
                auth: {
                    user: process.env.COSMODDB_USER,
                    password: process.env.COSMOSDB_PASSWORD
                }
            });
          
            console.log(functionName);
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
    
    let Exam = require('../models/exam');

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
                stateoferror: 27,
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
    let Basics = require('../models/basic');
    try {
       const getData = await Basics.find({ name: fields, basicssk : basicssk });

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
            error: [error.message, error.name],  
            stateoferror: 22
        }
        return Promise.reject(messageBody)
    }
}


module.exports = {
    connection,
    connectionToDB,
    disconectFromDB,
    handleMongoConnection,
    closeMongoDbConnection,
    readyStateMongoose,
    testIfExamIsInProgress,
    getSpecificDataFromDB
}