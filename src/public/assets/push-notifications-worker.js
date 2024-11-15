// push-notifications-worker.js

self.addEventListener('push', function(event) {
    const options = {
      body: event.data.text(),
      icon: './icons/icon-192x192.png', // Ruta correcta a tu ícono
      badge: './icons/icon-72x72.png'  // Ruta correcta a tu insignia
    };
  
    event.waitUntil(
      self.registration.showNotification('Nueva notificación', options)
    );
  });