var accessKey = 'iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==';
var storageAccount = 'firstazurefunctstorage';
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const multiparty = require('multiparty');

const createHandler = require("azure-function-express").createHandler;
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')
/* const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({
    storage: inMemoryStorage
});
 */

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


/* var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log("file.fieldname", file.fieldname);
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage
}).single('image') */
const upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=firstazurefunctstorage;AccountKey=iBGC5YWHnRlDuMs/3DL1zzx464NBGGD8Ss8xiaGDI7ZcV9/1LlZcH7vF9DLc3U0xtkO8TXXYj0NMxpIsxwP/6A==;EndpointSuffix=core.windows.net',
        containerName: 'images',
        containerSecurity: 'blob'
    })
}).single('image')


app.post('/api/uploadImage', function (req, res) {
    
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
        } else if (err) {
        }
        res.send("sve je ok");

      })
  
});

module.exports = createHandler(app);

/* module.exports = function (context, req) {
    console.log("req",req);
    let file = req.query.file;
    console.log(file);
    context.done()
} */