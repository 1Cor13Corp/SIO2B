import express from 'express';
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

app.use(require('./routes/index.routes.js'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;