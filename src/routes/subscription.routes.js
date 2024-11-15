import subscriptions from "../models/subscriptions";
const express = require('express');

const app = express();

app.post('/api/subscribe', async (req, res) => {
    const subscription_ = req.body;
  
    try {
      // Crea y guarda la suscripción en la base de datos
      const newSubscription = new subscriptions(subscription_);
      await newSubscription.save();
      
      res.status(201).json({ message: 'Suscripción guardada con éxito' });
    } catch (error) {
      console.error("Error al guardar la suscripción:", error);
      res.status(500).json({ error: 'Error al guardar la suscripción' });
    }
  });

  module.exports = app;