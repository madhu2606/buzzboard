const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
var cluster = require('cluster');
var path = require('path');
var cCPUs = require('os').cpus().length;
const config = require('./config/config.json');

const port = process.env.PORT || 5000;
var root = path.dirname(__dirname);
const app = express();

if (cluster.isMaster) {
    // Create a worker for each CPU
    for (var i = 0; i < cCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died.');
    });
}
else {
    const orders = require('./controllers/orders');

    mongoose.connect(config.mongoDB_Conn_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('useFindAndModify', false);

    app.use(morgan("dev"));
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/orders', orders);
    
    app.listen(port, (err) => {
        console.log("Server Listening on Port: " + port);
        console.log('Process ID: ' + process.pid);
    });
}