var mongoose = require('mongoose');


const connectionToDB = async () => {

    try {
        await mongoose.connect(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true&replicaSet=globaldb", {
            useNewUrlParser: true,
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

module.exports = {
    connectionToDB
}