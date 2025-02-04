const express = require('express');
const app = express();


app.use ( require('./login.routes'));
app.use ( require('./upload.routes'));
app.use ( require('./imagenes.routes'));
app.use ( require('./subscription.routes'));
app.use ( require('./etiquetas.routes'));

module.exports = app;