const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


import Usuario from '../models/usuario'
import {SEED, EXP} from '../config'
import verificarToken from '../Auth/autenticacion'

const app = express();

app.post('/api/usuario', async (req,res)=>{

    let body = req.body;

    try{
        let usuario = new Usuario({
            Nombre: body.Nombre,
            Apellido: body.Apellido,
            Correo: body.Correo,
            Password: bcrypt.hashSync(body.Password, 10),
            Role: body.Role,
            Departamento:body.Departamento
        });

        let savedUsuario = await usuario.save();
        res.status(201).send(savedUsuario);
    }catch(err){
        console.error('Error al guardar el usuario:', err);
        res.status(500).send({ error: 'Error al guardar el usuario' });
    }

});

app.get('/api/usuario', async (req, res) => {
    try {
        // Excluyendo el campo 'Password' de los resultados
        const usuarios = await Usuario.find().select('-Password').exec();
        res.json(usuarios);
    } catch (err) {
        console.error('Error en la búsqueda de los usuarios:', err);
        res.status(500).send({ error: 'Error en la búsqueda de los usuarios' });
    }
});


app.put('/api/usuario', async (req, res) => {
    try {
        const data = req.body; // Asegúrate de que req.body contenga los datos que esperas
        
        if (!data._id) {
            return res.status(400).send({ error: 'Falta el ID del usuario' });
        }

        if (data.Password) {
            data.Password = bcrypt.hashSync(data.Password, 10); // Corrige el acceso a data.Password
        }

        const result = await Usuario.findByIdAndUpdate(data._id, data, { new: true });

        if (!result) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.json({ done: true, usuario: result });
    } catch (err) {
        console.error('Error en la actualización de usuarios:', err);
        res.status(500).send({ error: 'Error en la actualización de usuarios' });
    }
});


app.delete('/api/usuario/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).send({ error: 'Falta el ID del usuario' });
        }

        const result = await Usuario.findByIdAndDelete(userId);
        
        if (!result) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        res.json({ done: true, message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).send({ error: 'Error al eliminar el usuario' });
    }
});

app.post('/api/login', async (req, res) => {
    const body = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ Correo: body.Correo });

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        const passwordValid = await bcrypt.compare(body.Password, usuarioDB.Password);

        if (!passwordValid) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        const token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn:EXP});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({
            ok: false,
            err
        });
    }
});

app.get('/api/renew', verificarToken, async (req, res) => {
    try {
        const token = jwt.sign(
            { usuario: req.usuario },
            SEED,
            { expiresIn: EXP }
        );

        res.json({
            ok: true,
            usuario: req.usuario,
            token,
        });
    } catch (err) {
        console.error('Error al renovar el token:', err);
        res.status(500).json({
            ok: false,
            err
        });
    }
});


module.exports = app;