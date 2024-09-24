const express = require('express');
const app = express();


app.use ( require('./login.routes'));
app.use ( require('./upload.routes'));
app.use ( require('./imagenes.routes'));

module.exports = app;