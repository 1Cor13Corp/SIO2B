const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

import prueba from '../models/analisis';


app.get('/api/imagen/:tipo/:img', (req, res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg)
    }else{
        let noImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImage);
    }


});

app.get('/api/analisis', async (req, res) => {
    try {
        const dynamicData = {
            test1:'prueba 1',
            test2:'prueba 2',
            test3:'prueba 3'
        }

        const nuevoAnalisis = new prueba({ dynamicData });
        await nuevoAnalisis.save();
        res.status(201).json({ message: 'Datos almacenados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = app;