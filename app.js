const express = require("express");
const FrontRoutes = require('./src/Routes/front')
const ApiRoutes = require('./src/Routes/api')
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use('/api/', ApiRoutes);
app.use('/', FrontRoutes);

module.exports = app;