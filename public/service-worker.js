self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: "Default Title", body: "Default body content." };
  console.log('Push Received:', data);

  const title = data.title || "Supplement Reminder";
  const options = {
    body: data.body || "Time to take your supplements!",
    icon: '/icons/icon-192x192.png', // Optional: Add an icon
    badge: '/icons/badge-72x72.png' // Optional: Add a badge (Android)
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('Notification click Received.', event.notification.data);

  event.notification.close();

  // Example: Focus or open the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/'); // Open the base URL if no window is open
    })
  );
});

console.log("Service Worker Loaded."); 